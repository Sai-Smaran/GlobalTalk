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
} from "react-native";
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config";
import firebase from "firebase";
import MyStackHeader from "../components/MyHeaders/MyStackHeader";
import {
  encrypt as btoa,
  decrypt as atob,
} from "../components/customBase64Encryption";
import { Audio } from "expo-av";

export default class PrivateChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: firebase.auth().currentUser.email,
      inputMessage: "",
      allMessages: [],
      userName: "",
      otherUserId: this.props.navigation.getParam("details")["email"],
      otherUserName: this.props.navigation.getParam("details")["user_name"],
      expoPushToken: this.props.navigation.getParam("details")["push_token"],
      docId: "",
    };
    this.unsub = null;
    this.soundunSub;
    this.soundunSub2;
    this.inputRef = null;
    this.listRef = null;
  }

  playSentSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sent.wav")
    );

    this.soundunSub = sound;

    this.soundunSub.playAsync();
  };

  playRecievedSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/recieve.mp3")
    );

    this.soundunSub2 = sound;

    this.soundunSub2.playAsync();
  };

  getAllPrivateMessages = () => {
    db.collection("messages")
      .where("visible_to", "array-contains-any", [this.state.otherUserId])
      .orderBy("created_at")
      .onSnapshot((snapshot) => {
        var messages = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            if (this.listRef !== null) {
              this.listRef.scrollToEnd();
            }
            if (change.doc.data().sender_email !== this.state.currentUserId) {
              this.playRecievedSound();
            }
          }
        });
        snapshot.forEach((doc) => {
          messages.push(doc.data());
        });
        this.setState({
          allMessages: messages,
        });
      });
  };

  getUserName() {
    db.collection("users")
      .where("email", "==", this.state.currentUserId)
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
          item.sender_email !== this.state.currentUserId
            ? { flexDirection: "row" }
            : { flexDirection: "row-reverse" }
        }
      >
        <View>
          <Text
            style={
              item.sender_email !== this.state.currentUserId
                ? styles.messagePopupConatiner
                : styles.alsoMessagePopupConatiner
            }
          >
            {atob(item.message)}
          </Text>
        </View>
      </View>
    );
  };

  sendMessage = (message) => {
    db.collection("messages")
      .add({
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        message: btoa(message),
        sender_name: this.state.userName,
        sender_email: this.state.currentUserId,
        visible_to: [this.state.otherUserId, this.state.currentUserId],
      })
      .then(() => {
        this.inputRef.clear();
        this.playSentSound();
        this.sendNotification();
      });
  };

  async componentDidMount() {
    this.getAllPrivateMessages();
    this.getUserName();
  }

  sendNotification = async () => {
    if (!this.state.expoPushToken) {
      console.log("Can't find user's token");
      return;
    }
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: this.state.expoPushToken,
        sound: "default",
        title: this.state.otherUserName,
        body: this.state.inputMessage,
      }),
    });
  };

  componentWillUnmount() {
    if (this.soundunSub) {
      this.soundunSub.unloadAsync();
    }
    if (this.soundunSub2) {
      this.soundunSub2.unloadAsync();
    }
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding">
        <MyStackHeader
          title={"Private chat - " + this.state.otherUserName}
          navigation={this.props.navigation}
        />
        <View style={{ height: "80%", backgroundColor: "#ebebeb" }}>
          {this.state.allMessages.length !== 0 ? (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allMessages}
              renderItem={this.renderItem}
              ref={(ref) => {
                ref !== null ? (this.listRef = ref) : (this.listRef = null);
              }}
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
