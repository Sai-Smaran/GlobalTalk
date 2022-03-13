import React, { useRef, useState } from "react";
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
import db from "../../config";
import firebase from "firebase";
import { MyStackHeader } from "../../components/UIComponents/MyHeaders";

export default function SignUpScreen({ navigation }: { navigation: any }): JSX.Element {
	const [userName, setUserName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [loading, setLoading] = useState(false);
	const emailRef = useRef(null);
	const passRef = useRef(null);
	const passverRef = useRef(null);

	const generateKeywords = (userName: string) => {
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

	const signUp = (email: string, pass: string) => {
		if (password !== password2) {
			Alert.alert("Error", "Both passwords are not the same/nPlease try again");
		} else {
			setLoading(true);
			firebase
				.auth()
				.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
				.then(() => {
					firebase
						.auth()
						.createUserWithEmailAndPassword(email, pass)
						.then(() => {
							setLoading(false);
							db.collection("users").add({
								email: email,
								user_name: userName,
								searchable_keywords: generateKeywords(userName),
								profile_url: "#",
							});
						})
						.catch((error) => {
							Alert.alert("Error", error.message);
							console.log(error.code);
						});
				});
		}
	};

	return (
		<View>
			<MyStackHeader title="Sign up" navigation={navigation} />
			<View style={{ alignItems: "center" }}>
				<TextInput
					placeholder="Username"
					autoCompleteType="username"
					maxLength={10}
					style={styles.loginInput}
					onChangeText={(text) => setUserName(text)}
					onSubmitEditing={() => emailRef.current.focus()}
					value={userName.trim()}
				/>
				<TextInput
					placeholder="Email address"
					style={styles.loginInput}
					autoCompleteType="email"
					keyboardType="email-address"
					onChangeText={(text) => setEmailAddress(text)}
					onSubmitEditing={() => passRef.current.focus()}
					ref={emailRef}
				/>
				<TextInput
					placeholder="Password"
					style={styles.loginInput}
					autoCompleteType="password"
					secureTextEntry={true}
					onChangeText={(text) => setPassword(text)}
					onSubmitEditing={() => passverRef.current.focus()}
					ref={passRef}
				/>
				<TextInput
					placeholder="Confirm password"
					style={styles.loginInput}
					secureTextEntry={true}
					onChangeText={(text) => setPassword2(text)}
					onSubmitEditing={() => {
						signUp(emailAddress, password);
					}}
					ref={passverRef}
				/>
				<TouchableOpacity
					style={styles.loginButton}
					onPress={() => signUp(emailAddress, password)}
				>
					{loading ? (
						<ActivityIndicator size="large" color="white" />
					) : (
						<Text style={styles.loginButtonText}>Sign up</Text>
					)}
				</TouchableOpacity>
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
