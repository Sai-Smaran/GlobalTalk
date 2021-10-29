import React, { Component } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Text,
  Image,
  Platform,
} from "react-native";
import { Icon, Avatar } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config";
import firebase from "firebase";
import Constants from "expo-constants";
import MyDrawerHeader from "../components/MyHeaders/MyDrawerHeader";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: true,
  })
});

export default class PrivateChat extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      inputMessage: "",
      allMessages: [],
      userName: "",
      pfpUrl: "#",
      unsubscribe: null,
      docId: "",
      notification: {}
    };
    this.inputRef = null;
    this.listRef = null;
  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      try {
        let token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        db.collection("users").doc(this.state.docId).update({
          push_token: token,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  fetchUserImage = () => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + this.state.userId);

    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({
          pfpUrl: url,
        });
      })
      .catch((error) => {
        console.log(error.code);
        this.setState({ pfpUrl: "#" });
      });
  };

  getAllPublicMessages = () => {
    var unsubscribe = db
      .collection("messages")
      .where("target", "==", "all")
      .orderBy("created_at")
      .onSnapshot((snapshot) => {
        var messages = [];
        snapshot.forEach((doc) => {
          messages.push(doc.data());
        });
        this.setState({
          allMessages: messages,
        });
      });
    return unsubscribe;
  };

  getUserName() {
    db.collection("users")
      .where("email", "==", this.state.userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().user_name,
            docId: doc.id,
          });
        });
      });
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    return (
      <View
        style={
          item.sender_email !== this.state.userId
            ? { flexDirection: "row" }
            : { flexDirection: "row-reverse" }
        }
      >
        <Avatar
          source={{
            uri: item.url,
          }}
          rounded
          size={RFValue(70)}
          title={item.sender_name.charAt(0).toUpperCase()}
        />
        <View>
          <Text style={{ fontWeight: "bold", fontSize: RFValue(20) }}>
            {item.sender_name}
          </Text>
          <Text
            style={
              item.sender_email !== this.state.userId
                ? styles.messagePopupConatiner
                : styles.alsoMessagePopupConatiner
            }
          >
            {item.message.toString()}
          </Text>
        </View>
      </View>
    );
  };

  sendMessage = (message) => {
    db.collection("messages")
      .add({
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        message: message,
        sender_name: this.state.userName,
        sender_email: this.state.userId,
        target: "all",
        url: this.state.pfpUrl,
      })
      .then(() => {
        this.inputRef.clear();
        this.listRef.scrollToEnd({ animated: true });
      });
  };

  handleChange = (e) => {
    const { value } = e.target;

    if (value !== "") {
      this.unsubscribe && this.unsubscribe();
      this.unsubscribe = this.getAllPublicMessages();
    }
  };

  async componentDidMount() {
    this.getAllPublicMessages();
    this.fetchUserImage();
    this.getUserName();
    await this.registerForPushNotificationsAsync();
  }

  componentWillUnmount() {
    this.unsubscribe ? this.unsubscribe() : null;
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding">
        <MyDrawerHeader
          title="Public chat"
          navigation={this.props.navigation}
        />
        <View style={{ height: "80%", backgroundColor: "#ebebeb" }}>
          {this.state.allMessages.length !== 0 ? (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allMessages}
              renderItem={this.renderItem}
              ref={(chatlist) => (this.listRef = chatlist)}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/sad-bubble.png")}
                width={100}
                height={100}
              />
              <Text style={{ color: "#9c9c9c" }}>
                Chat activity seems to be pretty dry today...
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#ebebeb" }}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type something here..."
            maxLength={128}
            ref={(input) => (this.inputRef = input)}
            onChangeText={(text) =>
              this.setState({
                inputMessage: text,
              })
            }
            value={this.state.inputMessage}
            numberOfLines={1}
            multiline
          />
          <TouchableOpacity
            onPress={() => this.sendMessage(this.state.inputMessage)}
          >
            <Icon
              name="paper-plane"
              type="font-awesome"
              reverse={true}
              raised={true}
              size={RFValue(30)}
              color="#80AED7"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  chatInput: {
    width: "80%",
    height: RFValue(75),
    borderColor: "gray",
    borderRadius: RFValue(50),
    backgroundColor: "white",
    shadowRadius: 1,
    elevation: 8,
    fontSize: RFValue(20),
    paddingLeft: 10,
  },
  messagePopupConatiner: {
    backgroundColor: "#80AED7",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    color: "white",
    padding: 5,
    fontSize: RFValue(16),
    maxWidth: "80%",
    maxWidth: 250,
  },
  alsoMessagePopupConatiner: {
    backgroundColor: "#80AED7",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    color: "white",
    padding: 5,
    fontSize: RFValue(16),
    maxWidth: 250,
  },
});
