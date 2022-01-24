import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import { Avatar, Input, Icon } from "react-native-elements";
import {
  getCameraPermissionsAsync,
  requestCameraPermissionsAsync,
  launchImageLibraryAsync,
  launchCameraAsync,
  MediaTypeOptions
} from "expo-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import MyDrawerHeader from "../components/MyHeaders/MyDrawerHeader";
import firebase from "firebase";
import db from "../config";

export default class UserInfoEditingScreen extends Component {
  state = {
    userId: firebase.auth().currentUser.email,
    docId: "",
    about: "",
    image: "#",
    userName: "",
    modalView: false,
  };

  getCameraPermissions = async () => {
    const { status: existingStatus } =
      await getCameraPermissionsAsync();
    let finalStatus = existingStatus;
    if (finalStatus !== "granted") {
      const { status } = await requestCameraPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === "denied") {
      Alert.alert(
        "Can't take photos",
        "Camera permissions are required to take a photo"
      );
      return;
    }
    await this.takePicture();
  };

  generateKeywords = (userName) => {
    const wordArr = userName.toLowerCase().split(" ");
    const searchableKeywords = [];
    let prevKey = "";
    for (const word of wordArr) {
      const charArr = word.toLowerCase().split("");
      for (const char of charArr) {
        const keyword = prevKey + char;
        searchableKeywords.push(keyword);
        prevKey = keyword;
      }
      prevKey = "";
    }

    return searchableKeywords;
  };

  takePicture = async () => {
    const { cancelled, uri } = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!cancelled) {
      this.setState({ modalView: false });
      this.uploadImage(uri, this.state.userId);
      this.fetchImage(this.state.userName);
    }
  };

  selectPicture = async () => {
    const { cancelled, uri } = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!cancelled) {
      this.setState({ modalView: false });
      this.uploadImage(uri, this.state.userId);
      this.fetchImage(this.state.userName);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
        console.log(error.code);
      });
  };

  getUserProfile() {
    db.collection("users")
      .where("email", "==", this.state.userId)
      .get()
      .then((query) => {
        query.forEach((doc) => {
          var data = doc.data();
          this.setState({
            userName: data.user_name,
            about: data.about,
            docId: doc.id,
          });
        });
      });
  }

  updateProfile(username, about) {
    db.collection("users")
      .doc(this.state.docId)
      .update({
        user_name: username,
        about: about,
        profile_url: this.state.image,
        searchable_keywords: this.generateKeywords(username),
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  editModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={this.state.modalView}
      onRequestClose={() => this.setState({ modalView: false })}
    >
      <View style={styles.modalStyle}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: "gray",
            height: "50%",
          }}
          onPress={() => {
            this.selectPicture();
          }}
        >
          <Icon name="add-photo-alternate" type="material" size={RFValue(40)} />
          <Text>Select a photo from gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={async () => {
            await this.getCameraPermissions();
          }}
        >
          <Icon name="add-a-photo" type="material" size={RFValue(40)} />
          <Text>Take a photo</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        {this.editModal()}
        <MyDrawerHeader
          title="Edit your profile"
          navigation={this.props.navigation}
        />
        <Avatar
          rounded
          source={{
            uri: this.state.image,
          }}
          onPress={() => this.setState({ modalView: true })}
          size={"xlarge"}
          showEditButton
          title={this.state.userName.charAt(0).toUpperCase()}
          raised={true}
        />
        <Input
          label="User name"
          onChangeText={(text) =>
            this.setState({
              userName: text,
            })
          }
          placeholder="What do you want to be called as?"
          value={this.state.userName.trim()}
          containerStyle={styles.inputStyle}
        />
        <Input
          label="About me"
          onChangeText={(text) =>
            this.setState({
              about: text,
            })
          }
          style={{
            height: RFValue(200),
            justifyContent: "flex-start",
          }}
          multiline
          numberOfLines={8}
          inputContainerStyle={{
            borderWidth: 2,
            borderRadius: 5,
            borderBottomWidth: 2,
            padding: 10,
          }}
          maxLength={50}
          numberOfLines={8}
          textAlignVertical="top"
          containerStyle={[styles.inputStyle]}
          placeholder="Describe yourself....."
          value={this.state.about}
        />
        <TouchableOpacity
          style={styles.saveStyle}
          onPress={() =>
            this.updateProfile(this.state.userName, this.state.about)
          }
        >
          <Text style={styles.saveTextStyle}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    width: "99%",
  },
  saveStyle: {
    flex: 0.5,
    backgroundColor: "#3D85C6",
    justifyContent: "center",
    width: "80%",
    height: 50,
    alignItems: "center",
    shadowColor: "black",
    elevation: 16,
    borderRadius: 20,
  },
  saveTextStyle: {
    fontSize: RFValue(20),
    color: "white",
    fontWeight: "bold",
  },
  modalStyle: {
    flex: 0.25,
    backgroundColor: "white",
    width: 300,
    alignSelf: "center",
    elevation: 32,
    marginTop: RFValue(250),
  },
});
