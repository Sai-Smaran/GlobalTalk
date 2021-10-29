import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config";
import firebase from "firebase";
import MyStackHeader from "../components/MyHeaders/MyStackHeader";

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      emailAddress: "",
      password: "",
      password2: "",
    };
    this.emailRef = null;
    this.passRef = null;
    this.passverRef = null;
  }

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

  signUp = (email, pass) => {
    if (this.state.password !== this.state.password2) {
      Alert.alert("Error", "Both passwords are not the same/nPlease try again");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, pass)
        .then(() => {
          db.collection("users").add({
            email: email,
            user_name: this.state.userName,
            searchable_keywords: this.generateKeywords(this.state.userName),
          });
          this.props.navigation.navigate("Drawer");
        })
        .catch((error) => {
          Alert.alert("Error", error.message);
          console.log(error.code);
        });
    }
  };

  render() {
    return (
      <View>
        <MyStackHeader title="Sign up" navigation={this.props.navigation} />
        <View style={{ alignItems: "center" }}>
          <TextInput
            placeholder="Username"
            autoCompleteType="username"
            maxLength={10}
            style={styles.loginInput}
            onChangeText={(text) =>
              this.setState({
                userName: text,
              })
            }
            onSubmitEditing={() => this.emailRef.focus()}
            value={this.state.userName.trim()}
          />
          <TextInput
            placeholder="Email address"
            style={styles.loginInput}
            autoCompleteType="email"
            keyboardType="email-address"
            onChangeText={(text) =>
              this.setState({
                emailAddress: text,
              })
            }
            onSubmitEditing={() => this.passRef.focus()}
            ref={(email) => (this.emailRef = email)}
          />
          <TextInput
            placeholder="Password"
            style={styles.loginInput}
            autoCompleteType="password"
            secureTextEntry={true}
            onChangeText={(text) =>
              this.setState({
                password: text,
              })
            }
            onSubmitEditing={() => this.passverRef.focus()}
            ref={(pass) => (this.passRef = pass)}
          />
          <TextInput
            placeholder="Confirm password"
            style={styles.loginInput}
            secureTextEntry={true}
            onChangeText={(text) =>
              this.setState({
                password2: text,
              })
            }
            onSubmitEditing={() => {
              this.signUp(this.state.emailAddress, this.state.password);
            }}
            ref={(passVer) => (this.passverRef = passVer)}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              this.signUp(this.state.emailAddress, this.state.password)
            }
          >
            <Text style={styles.loginButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginInput: {
    borderWidth: 1.5,
    borderColor: "#464646",
    width: "80%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    fontSize: RFValue(15),
    marginTop: RFValue(25),
    paddingLeft: RFValue(10),
    borderRadius: 10,
  },
  loginButton: {
    top: RFValue(50),
    width: "75%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#3D85C6",
    shadowColor: "#000",
    marginBottom: RFValue(50),
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "200",
    fontSize: RFValue(25),
  },
});
