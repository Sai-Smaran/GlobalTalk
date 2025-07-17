import { useCallback, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	Alert,
	Pressable,
} from "react-native";
import { Avatar, Input, Icon } from "@rneui/base";
import {
	getCameraPermissionsAsync,
	requestCameraPermissionsAsync,
	getMediaLibraryPermissionsAsync,
	launchImageLibraryAsync,
	launchCameraAsync,
	CameraType,
	requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

import { MyDrawerHeader } from "../components/UIComponents/MyHeaders";
import { auth, fstore, store } from "../config";

import type { DrawerStackScreenProps } from "../navigators/types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export function UserInfoEditingScreen() {
	const navigation =
		useNavigation<DrawerStackScreenProps<"UserInfoEdit">["navigation"]>();

	const [docId, setDocId] = useState("");
	const [about, setAbout] = useState("");
	const [image, setImage] = useState("#");
	const [userName, setUserName] = useState("");
	const [modalViewing, setModalViewing] = useState(false);

	const userId =
		auth.currentUser !== null && auth.currentUser.email !== null
			? auth.currentUser.email
			: "";

	const getCameraPermissions = async () => {
		const { status: existingStatus } = await getCameraPermissionsAsync();
		let finalStatus = existingStatus;
		if (finalStatus !== "granted") {
			const { status } = await requestCameraPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus === "denied") {
			Alert.alert(
				"Can't take photos",
				"Camera permissions are required to take a photo"
			);
			return;
		}
		await takePicture();
	};

	const getMediaLibraryPermissions = async () => {
		const { status: existingStatus } = await getMediaLibraryPermissionsAsync();
		let finalStatus = existingStatus;
		if (finalStatus !== "granted") {
			const { status } = await requestMediaLibraryPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus === "denied") {
			Alert.alert(
				"Can't take photos",
				"Camera permissions are required to take a photo"
			);
			return;
		}
		await selectPicture();
	};

	const generateKeywords = (userName: string) => {
		const wordArr = userName.toLowerCase().split(" ");
		const searchableKeywords: any[] = [];
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

	const takePicture = async () => {
		const { canceled, assets } = await launchCameraAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.9,
			cameraType: CameraType.front,
			allowsMultipleSelection: false,
		});

		if (!canceled) {
			await uploadImage(assets[0].uri, userId);
			fetchImage(userName);
		}
		setModalViewing((prev) => !prev);
	};

	const selectPicture = async () => {
		const { canceled, assets } = await launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.9,
			selectionLimit: 1,
			allowsMultipleSelection: false,
		});

		if (!canceled) {
			await uploadImage(assets[0].uri, userId);
			fetchImage(userName);
		}
		setModalViewing((prev) => !prev);
	};

	const uploadImage = async (uri: string, imageName: string) => {
		const response = await fetch(uri);
		const blob = await response.blob();

		const storageRef = ref(store, "user_profiles/" + imageName);

		return await uploadBytes(storageRef, blob).then(() => {
			fetchImage(imageName);
			console.log("upload Successful");
		});
	};

	const fetchImage = (imageName: string) => {
		const storageRef = ref(store, "user_profiles/" + imageName);

		getDownloadURL(storageRef)
			.then((url) => {
				setImage(url);
			})
			.catch((error) => {
				setImage("#");
				console.log(error.code);
			});
	};

	async function getUserProfile() {
		console.log("Fetching user info...");
		const q = query(collection(fstore, "users"), where("email", "==", userId));
		await getDocs(q).then((query) => {
			query.forEach((doc) => {
				const data = doc.data();
				setUserName(data.user_name);
				setAbout(data.about);
				setDocId(doc.id);
			});
		});
	}

	async function updateProfile(username: string, about: string) {
		const q = doc(fstore, "users", docId);
		await updateDoc(q, {
			user_name: username,
			about: about,
			profile_url: image,
			searchable_keywords: generateKeywords(username),
		});
	}

	useFocusEffect(
		useCallback(() => {
			fetchImage(userId);
			getUserProfile();
		}, [])
	);

	const EditModal = () => (
		<Modal
			animationType="fade"
			transparent
			// collapsable
			visible={modalViewing}
			onRequestClose={() => setModalViewing((prev) => !prev)}
		>
			<Pressable
				style={{ backgroundColor: "rgba(0,0,0,0.5)", height: "100%" }}
				onPress={() => setModalViewing((prev) => !prev)}
			/>
			<View
				style={{
					width: "100%",
					height: "100%",
					justifyContent: "center",
					alignItems: "center",
					position: "absolute",
				}}
			>
				<View
					style={{
						backgroundColor: "whitesmoke",
						elevation: 15,
					}}
				>
					<TouchableOpacity
						style={styles.changePfpBtn}
						onPress={async () => {
							await getCameraPermissions();
						}}
					>
						<Icon name="add-a-photo" color="black" size={RFValue(25)} />
						<Text style={{ fontSize: RFValue(20), left: 10 }}>
							Take a picture
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.changePfpBtn}
						onPress={async () => {
							await getMediaLibraryPermissions();
						}}
					>
						<Icon name="add-photo-alternate" color="black" size={RFValue(30)} />
						<Text style={{ fontSize: RFValue(20), left: 10 }}>
							Pick a photo from gallery
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);

	return (
		<View style={{ flex: 1, alignItems: "center" }}>
			<EditModal />
			<MyDrawerHeader
				title="Edit your profile"
				onDrawerIconPress={() => navigation.openDrawer()}
			/>
			<Avatar
				rounded
				source={{
					uri: image,
				}}
				onPress={() => setModalViewing((prev) => !prev)}
				size={"xlarge"}
				title={image === "#" && userName.charAt(0).toUpperCase()}
			/>
			<Input
				label="User name"
				onChangeText={(text) => setUserName(text)}
				placeholder="What do you want to be called as?"
				value={userName.trim()}
				containerStyle={styles.inputStyle}
			/>
			<Input
				label="About me"
				onChangeText={(text) => setAbout(text)}
				style={{
					maxHeight: RFValue(200),
					justifyContent: "flex-start",
				}}
				multiline
				numberOfLines={8}
				inputContainerStyle={{
					borderWidth: 2,
					borderRadius: 5,
					borderBottomWidth: 2,
					padding: 10,
				}}
				maxLength={50}
				textAlignVertical="top"
				containerStyle={styles.inputStyle}
				placeholder="Describe yourself....."
				value={about}
			/>
			<TouchableOpacity
				style={styles.saveStyle}
				onPress={() => updateProfile(userName, about)}
			>
				<Text style={styles.saveTextStyle}>Save</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	inputStyle: {
		width: "99%",
	},
	saveStyle: {
		backgroundColor: "#3D85C6",
		justifyContent: "center",
		width: "80%",
		height: 100,
		alignItems: "center",
		shadowColor: "black",
		elevation: 16,
		borderRadius: 20,
	},
	saveTextStyle: {
		fontSize: RFValue(20),
		color: "white",
		fontWeight: "bold",
	},
	modalStyle: {
		flex: 0.25,
		backgroundColor: "white",
		width: 300,
		alignSelf: "center",
		elevation: 32,
		marginTop: RFValue(250),
	},
	changePfpBtn: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		padding: 10,
	},
});
