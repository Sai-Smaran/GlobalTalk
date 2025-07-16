import { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	Alert,
} from "react-native";
import { Avatar, Input, Icon, Divider } from "@rneui/base";
import {
	getCameraPermissionsAsync,
	requestCameraPermissionsAsync,
	launchImageLibraryAsync,
	launchCameraAsync,
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

interface State {
	userId: string;
	docId: string;
	about: string;
	image: "#" | string;
	userName: string;
	modalView: boolean;
}

export class UserInfoEditingScreen extends Component<DrawerStackScreenProps<'UserInfoEdit'>, State> {
	constructor(props: DrawerStackScreenProps<"UserInfoEdit">) {
		super(props)
		this.state = {
			userId: auth.currentUser !== null && auth.currentUser.email !== null ? auth.currentUser.email : "",
			docId: "",
			about: "",
			image: "#",
			userName: "",
			modalView: false,
		};
	}

	getCameraPermissions = async () => {
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
		await this.takePicture();
	};

	generateKeywords = (userName: string) => {
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

	takePicture = async () => {
		//@ts-ignore
		const { cancelled, uri } = await launchCameraAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.9,

		});

		if (!cancelled) {
			this.setState({ modalView: false });
			this.uploadImage(uri, this.state.userId);
			this.fetchImage(this.state.userName);
		}
	};

	selectPicture = async () => {
		//@ts-ignore
		const { cancelled, uri } = await launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.9,

		});

		if (!cancelled) {
			this.setState({ modalView: false });
			this.uploadImage(uri, this.state.userId);
			this.fetchImage(this.state.userName);
		}
	};

	uploadImage = async (uri: string, imageName: string) => {
		const response = await fetch(uri);
		const blob = await response.blob();

		const storageRef = ref(store, "user_profiles/" + imageName);

		return await uploadBytes(storageRef, blob).then(() => {
			this.fetchImage(imageName);
			console.log("upload Successful")
		});
	};

	fetchImage = (imageName: string) => {
		const storageRef = ref(store, "user_profiles/" + imageName);

		getDownloadURL(storageRef)
			.then((url) => {
				this.setState({ image: url });
			})
			.catch((error) => {
				this.setState({ image: "#" });
				console.log(error.code);
			});
	};

	async getUserProfile() {
		console.log("Fetching user info...")
		const q = query(collection(fstore, "users"), where("email", "==", this.state.userId));
		await getDocs(q).then((query) => {
			query.forEach((doc) => {
				var data = doc.data();
				this.setState({
					userName: data.user_name,
					about: data.about,
					docId: doc.id,
				});
			});
		});
	}

	async updateProfile(username: string, about: string) {
		const q = doc(fstore, "users", this.state.docId);
		await updateDoc(q, {
			user_name: username,
			about: about,
			profile_url: this.state.image,
			searchable_keywords: this.generateKeywords(username),
		});
	}

	componentDidMount() {
		this.fetchImage(this.state.userId);
		this.getUserProfile();
	}

	editModal = () => (
		<Modal
			animationType="fade"
			transparent
			visible={this.state.modalView}
			onRequestClose={() => this.setState({ modalView: false })}
		>
			<View
				style={{
					width: "100%",
					height: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<View
					style={{
						backgroundColor: "whitesmoke",
						width: "50%",
						height: RFValue(80),
						elevation: 16,
					}}
				>
					<TouchableOpacity
						style={styles.changePfpBtn}
						onPress={async () => {
							await this.takePicture();
						}}
					>
						<Icon name="add-a-photo" color="black" size={RFValue(25)} />
						<Text style={{ fontSize: RFValue(10), left: 10 }}>
							Take a picture
						</Text>
					</TouchableOpacity>
					<Divider
						orientation="horizontal"
						style={{ width: "95%", alignSelf: "center" }}
						width={1.5}
					/>
					<TouchableOpacity
						style={styles.changePfpBtn}
						onPress={async () => {
							await this.selectPicture();
						}}
					>
						<Icon name="add-photo-alternate" color="black" size={RFValue(30)} />
						<Text style={{ fontSize: RFValue(10), left: 10 }}>
							Pick a photo from gallery
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);

	render() {
		return (
			<View style={{ flex: 1, alignItems: "center" }}>
				{this.editModal()}
				<MyDrawerHeader
					title="Edit your profile"
					onDrawerIconPress={() => this.props.navigation.openDrawer()}
				/>
				<Avatar
					rounded
					source={{
						uri: this.state.image,
					}}
					onPress={() => this.setState({ modalView: true })}
					size={"xlarge"}
					title={this.state.image === "#" && this.state.userName.charAt(0).toUpperCase()}
				/>
				<Input
					label="User name"
					onChangeText={(text) =>
						this.setState({
							userName: text,
						})
					}
					placeholder="What do you want to be called as?"
					value={this.state.userName.trim()}
					containerStyle={styles.inputStyle}
				/>
				<Input
					label="About me"
					onChangeText={(text) =>
						this.setState({
							about: text,
						})
					}
					style={{
						height: RFValue(200),
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
					value={this.state.about}
				/>
				<TouchableOpacity
					style={styles.saveStyle}
					onPress={() =>
						this.updateProfile(this.state.userName, this.state.about)
					}
				>
					<Text style={styles.saveTextStyle}>Save</Text>
				</TouchableOpacity>
			</View>
		);
	}
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
