import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import { Audio } from "expo-av";
import {
	launchImageLibraryAsync,
	MediaTypeOptions,
	ExpandImagePickerResult,
	ImagePickerResult,
	OpenFileBrowserOptions,
} from "expo-image-picker";
import firebase from "firebase";
import db from "../../config";
import { encrypt as btoa } from "../customBase64Encryption";
import { RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";

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
	const [sentSound, setSentSound] = useState<Audio.Sound>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const inputRef = useRef<TextInput>(null);

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
			allowsEditing: false,
		});

		if (!cancelled) {
			navigation.navigate("Confirm", {
				imageUrls: [{ uri }],
				senderId: otherUserId,
				pushToken: expoPushToken,
			});
		}
	}, []);
	const selectMotionPicture = useCallback(async () => {
		let returnedDt: any;
		///@ts-ignore
		await launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Videos,
			quality: 1,
			videoQuality: 0.75,
			videoMaxDuration: 900000,
		})
			.then((dt) => {
				returnedDt = dt;
			})
			.catch((err) => {
				Alert.alert("Error", "Cannot read file. Maybe the file is corrupted?");
				console.log(err);
			});

		if (!returnedDt.cancelled) {
			if (returnedDt.duration > 900000) {
				ToastAndroid.show("Video is too long", ToastAndroid.SHORT);
				return;
			}
			navigation.navigate("Confirm-video", {
				imageUrl: returnedDt.uri,
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

	useFocusEffect(
		React.useMemo(() => {
			loadSentSound();
			return sentSound
				? () => {
						sentSound.unloadAsync();
				  }
				: () => {};
		}, [])
	);

	const SelectMediaTypeModal = () => (
		<Modal
			transparent
			animationType="fade"
			visible={isModalVisible}
			onRequestClose={() => setIsModalVisible(false)}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: "rgba(0,0,0, 0.6)",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<View
					style={{
						backgroundColor: "white",
						width: "75%",
						height: 360,
						borderRadius: 20,
					}}
				>
					<View
						style={{
							height: "35%",
							width: "100%",
							justifyContent: "center",
						}}
					>
						<Text
							style={{
								padding: 25,
								fontSize: RFValue(25),
								color: "rgb(20,20,20)",
							}}
						>
							Select media type to upload
						</Text>
					</View>
					<Pressable
						style={{
							width: "100%",
							height: "27.5%",
							alignItems: "center",
							flexDirection: "row",
						}}
						onPress={async () => {
							await selectPicture();
							setIsModalVisible(false);
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								padding: 10,
							}}
						>
							<Icon name="photo" size={50} color="green" />
							<Text style={{ fontSize: 25, paddingHorizontal: 20 }}>
								Images
							</Text>
						</View>
					</Pressable>
					<Pressable
						style={{
							width: "100%",
							height: "27.5%",
							alignItems: "center",
							flexDirection: "row",
						}}
						onPress={async () => {
							setIsModalVisible(false);
							await selectMotionPicture();
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								padding: 10,
							}}
						>
							<Icon name="video" type="entypo" size={50} color="green" />
							<Text style={{ fontSize: 25, paddingHorizontal: 20 }}>
								Videos
							</Text>
						</View>
					</Pressable>
				</View>
			</View>
		</Modal>
	);

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
			<SelectMediaTypeModal />
			<View style={styles.chatInput}>
				<TouchableOpacity
					style={{
						padding: RFValue(15),
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={() => {
						// selectPicture();
						setIsModalVisible(true);
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
