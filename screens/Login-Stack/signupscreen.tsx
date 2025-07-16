import { useRef, useState } from "react";
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
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import { auth, fstore } from "../../config";
import { MyStackHeader } from "../../components/UIComponents/MyHeaders";
import type { LoginStackScreenProps } from "../../navigators/types";

export default function SignUpScreen() {
	const [userName, setUserName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [loading, setLoading] = useState(false);

	const emailRef = useRef<TextInput | null>(null);
	const passRef = useRef<TextInput | null>(null);
	const passverRef = useRef<TextInput | null>(null);
	const navigation = useNavigation<LoginStackScreenProps<'SignUp'>['navigation']>();

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
			Alert.alert(
				"Error",
				"Both passwords are not the same./nPlease try again"
			);
		} else {
			setLoading(true);
			setPersistence(auth, browserLocalPersistence).then(() => {
				createUserWithEmailAndPassword(auth, email, pass)
					.then(() => {
						setLoading(false);
						const docQ = collection(fstore, "users");
						addDoc(docQ, {
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
			<MyStackHeader title="Sign up" onBackPress={() => navigation.goBack()} />
			<View style={{ alignItems: "center" }}>
				<TextInput
					placeholder="Username"
					autoComplete="username"
					maxLength={10}
					style={styles.loginInput}
					onChangeText={(text) => setUserName(text)}
					onSubmitEditing={() => emailRef !== null && emailRef.current.focus()}
					value={userName.trim()}
				/>
				<TextInput
					placeholder="Email address"
					style={styles.loginInput}
					autoComplete="email"
					keyboardType="email-address"
					onChangeText={(text) => setEmailAddress(text)}
					onSubmitEditing={() => passRef !== null && passRef.current.focus()}
					ref={emailRef}
				/>
				<TextInput
					placeholder="Password"
					style={styles.loginInput}
					autoComplete="new-password"
					keyboardType="visible-password"
					secureTextEntry={true}
					onChangeText={(text) => setPassword(text)}
					onSubmitEditing={() => passverRef !== null && passverRef.current.focus()}
					ref={passRef}
				/>
				<TextInput
					placeholder="Confirm password"
					style={styles.loginInput}
					autoComplete="new-password"
					keyboardType="visible-password"
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
