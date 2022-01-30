import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Modal, Text } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "react-native-elements";
import ImageView from "react-native-image-viewing";
import { RFValue } from "react-native-responsive-fontsize";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import firebase from "firebase";
import db from "../config";
import CircularProgress from "../components/UIComponents/circular-progress";
import { setStatusBarHidden } from "expo-status-bar";

export default class ConfirmSendImage extends Component {
  constructor(props) {
    super(props);
    this.viewerRef;
    this.state = {
      currentUserId: firebase.auth().currentUser.email,
      imageUrls: this.props.route.params.imageUrls,
      otherUserId: this.props.route.params.senderId,
      currentUserName: "",
      visible: false,
      caption: "",
      editorVisible: false,
      imagesUploaded: 0,
      progress: 0,
      undetermined: true,
      expoPushToken: this.props.route.params.pushToken,
    };
    this.inputRef;
    this.viewNo = 0;
  }

  addImage = async () => {
    let imgUrls = this.state.imageUrls;
    const { cancelled, uri } = await launchImageLibraryAsync({
      quality: 1,
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: false,
    });

    if (!cancelled) {
      imgUrls.push({ uri: uri });
      this.setState({ imageUrls: imgUrls });
    }
  };

  sendNotification = async () => {
    if (!this.state.expoPushToken) {
      console.log("Can't find user's token");
      return;
    }
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        to: this.state.expoPushToken,
        sound: "default",
        title: this.state.userName,
        body: "Image 📷",
      }),
    }).catch((err) => {
      console.log(err);
    });
  };

  sendMessage = (imgArray) => {
    const docId =
      this.state.otherUserId > this.state.currentUserId
        ? this.state.currentUserId + "-" + this.state.otherUserId
        : this.state.otherUserId + "-" + this.state.currentUserId;
    db.collection("chat_sessions")
      .doc(docId)
      .collection("messages")
      .add({
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        media: imgArray,
        media_type: "image",
        sender_email: this.state.currentUserId,
        sender_name: this.state.currentUserName,
      })
      .then(async () => await this.sendNotification());
  };

  getUserName = () => {
    db.collection("users")
      .where("email", "==", this.state.currentUserId)
      .get()
      .then((query) => {
        query.forEach((doc) =>
          this.setState({
            currentUserName: doc.data().user_name,
          })
        );
      });
  };

  componentDidMount() {
    this.getUserName();
  }

  uploadImgs = async () => {
    let imgUrls = this.state.imageUrls;
    var imgUrlList = [];
    imgUrls.forEach(async (url, imgIndex) => {
      let imgUrl = url.uri;
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      let randomId = uuidv4();

      const ref = firebase.storage().ref();

      const uploadTask = ref.child(`shared_media/${randomId}`).put(blob);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          let uploadProgress = snapshot.bytesTransferred / snapshot.totalBytes;
          this.setState({ progress: uploadProgress });
        },
        (err) => {
          console.log("Error: " + err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            imgUrlList.push(downloadURL);
            let sentImgsNumber = this.state.imagesUploaded;
            sentImgsNumber++;
            this.setState({ imagesUploaded: sentImgsNumber });
            if (sentImgsNumber === this.state.imageUrls.length) {
              this.sendMessage(imgUrlList);
              setTimeout(() => {
                this.props.navigation.navigate("Chat");
              }, 5000);
            }
          });
        }
      );
    });
  };

  loadingModal = () => {
    return (
      <Modal
        transparent
        visible={this.state.visible}
        onRequestClose={() => {
          this.setState({ visible: false, imagesUploaded: 0 });
        }}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000066",
          }}
        >
          <View
            style={{
              width: "80%",
              height: "60%",
              backgroundColor: "white",
              elevation: 16,
              shadowColor: "black",
              shadowRadius: 25,
              borderRadius: RFValue(10),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <CircularProgress
                progress={this.state.progress}
                maxCount={this.state.imageUrls.length}
                count={this.state.imagesUploaded}
              />
              <Text
                style={{
                  paddingVertical: 20,
                  fontFamily: "sans-serif-medium",
                  fontSize: RFValue(20),
                }}
              >
                {this.state.imageUrls.length === this.state.imagesUploaded
                  ? this.state.imageUrls.length > 1
                    ? "Uploaded Images"
                    : "Uploaded Image"
                  : this.state.imageUrls.length > 1
                  ? "Uploading Images...."
                  : "Uploading Image...."}
              </Text>
              <Text
                style={{
                  fontFamily: "sans-serif-light",
                  fontSize: RFValue(20),
                  color: "darkgray",
                }}
              >
                {this.state.imageUrls.length > 1
                  ? `${this.state.imagesUploaded}/${this.state.imageUrls.length}`
                  : null}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderHeader = (index) => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <Icon name="close" color="white" size={40} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: RFValue(175),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (this.state.imageUrls.length > 1) {
                let imgUrls = this.state.imageUrls;
                imgUrls.splice(index, 1);
                this.setState({
                  imageUrls: imgUrls,
                });
              } else {
                this.props.navigation.goBack();
              }
            }}
          >
            <Icon
              name="image-remove"
              type="material-community"
              size={35}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({ visible: true });
              this.uploadImgs();
            }}
          >
            <Icon name="check" color="white" size={35} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await this.addImage();
            }}
          >
            <Icon name="library-add" type="material" size={35} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  keyExtractor = (_, index) => index.toString();

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.loadingModal()}
        <ImageView
          images={this.state.imageUrls}
          imageIndex={0}
          visible
          swipeToCloseEnabled={false}
          onRequestClose={() => this.props.navigation.goBack()}
          HeaderComponent={({ imageIndex }) => {
            this.viewNo = imageIndex;
            return this.renderHeader(imageIndex);
          }}
          presentationStyle="overFullScreen"
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topLeftOptions: {
    marginLeft: 30,
  },
  headerContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#01010169",
  },
  chatInput: {
    fontSize: 20,
    height: RFValue(75),
    borderColor: "gray",
    borderRadius: RFValue(50),
    backgroundColor: "white",
    shadowRadius: 1,
    elevation: 8,
    paddingLeft: 10,
    width: "80%",
    flexDirection: "row-reverse",
  },
});
