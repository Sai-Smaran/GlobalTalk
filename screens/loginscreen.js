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
	Dimensions,
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
			width: Dimensions.get("window").width,
		};
		this.inputRef = null;
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

	loginWithZucc = () => {
		//TODO: Add login with facebook
		return Alert.alert(
			"Work in progress",
			"Login with facebook is still under work in progress"
		);
	};

	twoFactorAuth = () => {
		//TODO: Add 2fa
	};

	googleLogin = () => {
		//TODO: Add login with google
		return Alert.alert(
			"Work in progress",
			"Login with google is still under work in progress"
		);
	};

	emailLogin = (email, pass) => {
		const { navigation } = this.props;
		firebase
			.auth()
			.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
			.then(() => {
				firebase
					.auth()
					.signInWithEmailAndPassword(email, pass)
					.catch((error) => {
						var errorCode = error.code;
						var errorMessage = error.message;
						console.log(errorCode);
						this.setState({ loading: false });
						return Alert.alert("Error", errorMessage);
					});
			})
			.catch((error) => {
				console.log(`Error : ${error.code},
					${error.message}
				`);
			});
	};

	componentDidMount() {
		this.setState({ loading: false });
		firebase.auth().onAuthStateChanged((user) => {
			if (user.email) {
				console.log(this.props.navigation.navigate("Drawer"));
			}
		});
		this.dimListener = Dimensions.addEventListener("change", ({ window }) => {
			this.setState({
				width: window.width,
			});
		});
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
				<View style={{ alignItems: "center", flex: 1 }}>
					<View
						style={{
							width: "100%",
							flexDirection: this.state.width >= 1024 ? "row" : "column",
						}}
					>
						<View
							style={{
								width: this.state.width >= 1024 ? "50%" : "100%",
								alignItems: "center",
							}}
						>
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
									marginTop: RFValue(25),
									width: "80%",
								}}
							>
								<TextInput
									placeholder="Password"
									placeholderTextColor="gray"
									autoCompleteType="password"
									keyboardType="default"
									style={[
										styles.loginInput,
										{
											marginTop: 0,
											borderRadius: 0,
											borderTopLeftRadius: 10,
											borderBottomLeftRadius: 10,
											flex: 1,
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
										height: "100%",
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
								onPress={() => {
									this.props.navigation.navigate("SignUp");
								}}
								style={{ marginTop: 25 }}
							>
								<Text style={styles.signupBtnTxt}>
									New to this app? Sign UP!
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								alignItems: "center",
								width: this.state.width >= 1024 ? "50%" : "100%",
								justifyContent: "center",
							}}
						>
							<Text style={{ color: "gray", marginTop: 30 }}>
								Or try signing in with
							</Text>
							<View
								style={{
									flexDirection: "row",
									width: "50%",
									justifyContent: "space-evenly",
									marginTop: 25,
								}}
							>
								<TouchableOpacity
									style={styles.googleLoginButton}
									onPress={() => this.googleLogin()}
								>
									<Image
										source={require("../assets/static-images/google.png")}
										style={{ width: RFValue(45), height: RFValue(45) }}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.googleLoginButton}
									onPress={() => this.loginWithZucc}
								>
									<Image
										source={require("../assets/static-images/facebook.png")}
										style={{ width: RFValue(55), height: RFValue(55) }}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
					<Text style={styles.disclaimerText}>
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
		marginTop: RFValue(30),
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
		backgroundColor: "whitesmoke",
		justifyContent: "center",
		alignItems: "center",
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
	disclaimerText: {
		color: "#9c9c9c",
		marginTop: RFValue(50),
		width: "80%",
		textAlign: "center",
	},
});
