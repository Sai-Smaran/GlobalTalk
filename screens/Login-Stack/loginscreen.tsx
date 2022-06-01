import React, { useMemo, useRef, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
	ActivityIndicator,
	useWindowDimensions,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Divider, Header, Icon } from "react-native-elements";
import firebase from "firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function LoginScreen({ navigation }: { navigation: any }) {
	const [emailId, setEmailId] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [passNotVisible, setPassNotVisible] = useState(true);
	const inputRef = useRef<TextInput>(null);
	const { width } = useWindowDimensions();

	const loginWithZucc = () => {
		//TODO: Add login with facebook
		return Alert.alert(
			"Work in progress",
			"Login with facebook is still under work in progress"
		);
	};

	const _twoFactorAuth = () => {
		//TODO: Add 2fa
	};

	const googleLogin = () => {
		//TODO: Add login with google
		return Alert.alert(
			"Work in progress",
			"Login with google is still under work in progress"
		);
	};

	const emailLogin = (email: string, pass: string) => {
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
						setLoading(false);
						return Alert.alert("Error", errorMessage);
					});
			})
			.catch((error) => {
				console.log(`Error : ${error.code},
					${error.message}
				`);
			});
	};

	useFocusEffect(
		useMemo(() => {
			setLoading(false);
			return () => {};
		}, [])
	);

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
						flexDirection: width >= 1024 ? "row" : "column",
					}}
				>
					<View
						style={{
							width: width >= 1024 ? "50%" : "100%",
							alignItems: "center",
						}}
					>
						<TextInput
							placeholder="Email ID"
							placeholderTextColor="gray"
							autoCompleteType="email"
							keyboardType="email-address"
							onSubmitEditing={() => {
								inputRef.current.focus();
							}}
							style={styles.loginInput}
							onChangeText={(text) => {
								setEmailId(text.trim());
							}}
							returnKeyType="next"
							value={emailId}
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
								ref={inputRef}
								secureTextEntry={passNotVisible}
								onSubmitEditing={() => {
									emailLogin(emailId, password);
									setLoading(true);
								}}
								onChangeText={(text) => {
									setPassword(text);
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
									setPassNotVisible(!passNotVisible);
								}}
							>
								<Icon
									name={passNotVisible ? "eye-with-line" : "eye"}
									type="entypo"
									color={passNotVisible ? "gray" : "#3D85C6"}
								/>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							style={styles.loginButton}
							disabled={loading}
							onPress={() => {
								emailLogin(emailId, password);
								setLoading(true);
							}}
						>
							{loading ? (
								<ActivityIndicator size="large" color="white" />
							) : (
								<Text style={styles.loginButtonText}>Log in</Text>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate("SignUp");
							}}
							style={{ marginTop: 25 }}
						>
							<Text style={styles.signupBtnTxt}>New to this app? Sign UP!</Text>
						</TouchableOpacity>
					</View>
					<Divider
						orientation={width >= 1024 ? "vertical" : "horizontal"}
						width={1.5}
					/>
					<View
						style={{
							alignItems: "center",
							width: width >= 1024 ? "50%" : "100%",
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
								onPress={() => googleLogin()}
							>
								<Image
									source={require("../../assets/static-images/google.png")}
									style={{ width: RFValue(45), height: RFValue(45) }}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.googleLoginButton}
								onPress={() => loginWithZucc()}
							>
								<Image
									source={require("../../assets/static-images/facebook.png")}
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
