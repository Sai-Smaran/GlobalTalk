import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import firebase from "firebase";
import db from "../../config";
import { encrypt as btoa } from "../customBase64Encryption";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";

interface Props {
	otherUserId: string;
	navigation: any;
	expoPushToken: string;
	userName: string;
	onRecord: () => void;
}

export default function ChatInput({
	otherUserId,
	navigation,
	expoPushToken,
	userName,
	onRecord,
}: Props) {
	const [inputMessage, setInputMessage] = useState("");
	const [currentUserId] = useState(firebase.auth().currentUser.email);
	const [sentSound, setSentSound] = useState(null);
	const inputRef = useRef(null);

	const sendNotification = useCallback(async () => {
		if (!expoPushToken) {
			console.log("Can't find user's token");
			return;
		}
		let response = await fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				to: expoPushToken,
				sound: "default",
				title: userName,
				body: inputMessage,
			}),
		});
		await response.json().then((resp: object) => {
			console.log(resp);
		});
	}, []);

	const sendMessage = useCallback((message) => {
		const docId =
			otherUserId > currentUserId
				? currentUserId + "-" + otherUserId
				: otherUserId + "-" + currentUserId;
		db.collection("chat_sessions")
			.doc(docId)
			.collection("messages")
			.add({
				created_at: firebase.firestore.FieldValue.serverTimestamp(),
				message: btoa(message),
				sender_email: currentUserId,
				looked: false,
			})
			.then(() => {
				inputRef.current.clear();
				sentSound.playAsync();
				sendNotification();
			});
	}, []);

	const selectPicture = useCallback(async () => {
		///@ts-ignore
		const { cancelled, uri } = await launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Images,
			quality: 1,
		});

		if (!cancelled) {
			navigation.navigate("Confirm", {
				imageUrls: [{ uri }],
				senderId: otherUserId,
				pushToken: expoPushToken,
			});
		}
	}, []);

	const loadSentSound = useCallback(async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("../../assets/sounds/sent.wav")
		);

		setSentSound(sound);
	}, []);

	useEffect(() => {
		loadSentSound();
		return sentSound
			? () => {
					sentSound.unloadAsync();
			  }
			: undefined;
	}, []);

	return (
		<View
			style={{
				flexDirection: "row",
				backgroundColor: "#ebebeb",
				width: "100%",
				justifyContent: "center",
				position: "absolute",
				bottom: 0,
			}}
		>
			<View style={styles.chatInput}>
				<TouchableOpacity
					style={{
						padding: RFValue(15),
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={(): void => {
						selectPicture();
					}}
				>
					<Icon
						name="upload"
						type="entypo"
						size={RFValue(25)}
						color="#696969"
					/>
				</TouchableOpacity>
				<TextInput
					style={{
						fontSize: RFValue(20),
						backgroundColor: "white",
						borderRadius: RFValue(50),
						paddingHorizontal: RFValue(25),
					}}
					placeholder="Say something..."
					maxLength={128}
					ref={inputRef}
					onChangeText={(text) => setInputMessage(text)}
					value={inputMessage}
					numberOfLines={1}
					multiline
				/>
			</View>
			{inputMessage.trim() !== "" ? (
				<TouchableOpacity
					onPress={() => {
						sendMessage(inputMessage);
					}}
				>
					<Icon
						name="paper-plane"
						type="font-awesome"
						reverse
						raised
						size={RFValue(35)}
						color="#80AED7"
					/>
				</TouchableOpacity>
			) : (
				<TouchableOpacity onPress={onRecord}>
					<Icon
						name="microphone"
						type="font-awesome"
						reverse
						raised
						size={RFValue(35)}
						color="#80AED7"
					/>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	chatInput: {
		height: RFValue(75),
		borderColor: "gray",
		borderRadius: RFValue(50),
		backgroundColor: "white",
		shadowRadius: 1,
		elevation: 8,
		paddingLeft: 10,
		width: "80%",
		flexDirection: "row-reverse",
		justifyContent: "space-between",
	},
});
