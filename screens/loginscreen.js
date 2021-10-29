import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Header, Icon } from "react-native-elements";
import firebase from "firebase";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: "",
      password: "",
      loading: false,
      passNotVisible: true,
    };
    this.inputRef = null;
  }

  loginWithZucc = () => {
    return Alert.alert(
      "Work in progress!",
      "Logging in with facebook is still being worked on. Stay tuned!"
    );
    // var zucc = new firebase.auth.FacebookAuthProvider();
    // zucc.addScope("email");
    // zucc.addScope("public_profile");
    // firebase
    //   .auth()
    //   .signInWithRedirect(zucc)
    //   .then(() => {
    //     firebase
    //       .auth()
    //       .getRedirectResult()
    //       .then((result) => {
    //         db.collection("users").add({
    //           user_name: result.user.displayName,
    //           email: result.user.email,
    //           profile_url: result.user.photoURL,
    //         });
    //       });
    //   });
  };

  googleLogin = () => {
    return Alert.alert(
      "Work in progress!",
      "Logging in with google is still being worked on. Stay tuned!"
    );
    // var provider = new firebase.auth.GoogleAuthProvider();
    // firebase
    //   .auth()
    //   .signInWithRedirect(provider)
    //   .then(() => {
    //     firebase
    //       .auth()
    //       .getRedirectResult()
    //       .then((result) => {
    //         db.collection("users").add({
    //           email: result.user.email,
    //           user_name: result.user.displayName,
    //           profile_picture_url: result.user.photoURL,
    //         });
    //         this.props.navigation.navigate("Drawer");
    //       })
    //       .catch((error) => {
    //         //Handle errors here
    //         var message = error.message;
    //         return Alert.alert("Error", message);
    //       });
    //   });
  };

  emailLogin = (email, pass) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(() => {
        this.props.navigation.navigate("Drawer");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        this.setState({ loading: false });
        return Alert.alert("Error", errorMessage);
      });
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#ebebeb" }}>
        <Header
          centerComponent={{
            text: "Log in",
            style: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },
          }}
          backgroundColor="#666666"
        />
        <View style={{ alignItems: "center" }}>
          <TextInput
            placeholder="Email ID"
            placeholderTextColor="gray"
            autoCompleteType="email"
            keyboardType="email-address"
            onSubmitEditing={() => {
              this.inputRef.focus();
            }}
            style={styles.loginInput}
            onChangeText={(text) => {
              this.setState({
                emailId: text,
              });
            }}
          />
          <View
            style={{
              flexDirection: "row",
              height: RFValue(50),
              top: RFValue(25),
            }}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              autoCompleteType="password"
              style={[
                styles.loginInput,
                {
                  width: "66%",
                  marginTop: 0,
                  borderRadius: 0,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                },
              ]}
              ref={(input) => (this.inputRef = input)}
              secureTextEntry={this.state.passNotVisible}
              onSubmitEditing={() => {
                this.emailLogin(this.state.emailId, this.state.password);
                this.setState({ loading: true });
              }}
              onChangeText={(text) => {
                this.setState({
                  password: text,
                });
              }}
              autoCorrect={false}
            />
            <TouchableOpacity
              style={{
                borderWidth: 1.5,
                borderColor: "#464646",
                height: RFValue(50),
                width: RFValue(50),
                justifyContent: "center",
                borderBottomRightRadius: 10,
                borderTopRightRadius: 10,
                borderLeftWidth: 0,
              }}
              onPress={() => {
                this.state.passNotVisible
                  ? this.setState({ passNotVisible: false })
                  : this.setState({ passNotVisible: true });
              }}
            >
              <Icon
                name={this.state.passNotVisible ? "eye-with-line" : "eye"}
                type="entypo"
                color={this.state.passNotVisible ? "gray" : "#3D85C6"}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            disabled={this.state.loading}
            onPress={() => {
              this.emailLogin(this.state.emailId, this.state.password);
              this.setState({ loading: true });
            }}
          >
            {this.state.loading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Log in</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: RFValue(20),
              marginBottom: RFValue(20),
              height: 30,
            }}
            onPress={() => {
              this.props.navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.signupBtnTxt}>New to this app? Sign UP!</Text>
          </TouchableOpacity>
          <View style={{ marginTop: RFValue(30), alignItems: "center" }}>
            <Text style={{ color: "gray" }}>Or try signing in with</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.googleLoginButton}
                onPress={() => this.googleLogin}
              >
                <Image
                  source={require("../assets/google.png")}
                  style={{ width: RFValue(45), height: RFValue(45) }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.googleLoginButton}
                onPress={() => this.loginWithZucc}
              >
                <Image
                  source={require("../assets/facebook.png")}
                  style={{ width: RFValue(55), height: RFValue(55) }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{ color: "#9c9c9c", marginTop: RFValue(50), width: "80%" }}
          >
            Note: This app is under beta right now, meaning that this app has a
            lot of bugs and crashes to fix, and this app may or may not be the
            same in the final build.
          </Text>
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
    marginTop: RFValue(50),
    width: "75%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#3D85C6",
    shadowColor: "#000",
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
  googleLoginButton: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: "white",
    justifyContent: "center",
    left: RFValue(20),
    alignItems: "center",
    top: RFValue(30),
    marginRight: RFValue(40),
    width: RFValue(55),
    height: RFValue(55),
    elevation: 8,
    shadowRadius: 1,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  signupBtnTxt: {
    fontWeight: "bold",
    fontSize: RFValue(20),
    color: "#80AED7",
  },
});
