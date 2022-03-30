import React, { Component } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	KeyboardAvoidingView,
	Text,
	Image,
} from "react-native";
import { Icon, Avatar } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config";
import firebase from "firebase";
import { isDevice } from "expo-device";
import { MyDrawerHeader } from "../components/UIComponents/MyHeaders";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: false,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

interface Props {
	navigation: any;
}

interface State {
	userId: string;
	inputMessage: string;
	allMessages: Message[];
	userName: string;
	pfpUrl: "#" | string;
	docId: string
}

interface Message {
	created_at: firebase.firestore.FieldValue;
	looked: boolean;
	message: string;
	sender_email: string;
}

export default class PublicChat extends Component<Props, State> {
	inputRef: TextInput;
	listRef: FlatList<any>;
	unsubscribe: any;
	constructor(props: Props) {
		super(props);
		this.state = {
			userId: firebase.auth().currentUser.email,
			inputMessage: "",
			allMessages: [],
			userName: "",
			pfpUrl: "#",
			docId: "",
		};
		this.unsubscribe = null;
		this.inputRef = null;
		this.listRef = null;
	}

	registerForPushNotificationsAsync = async () => {
		if (isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				return;
			}
			console.log(finalStatus);
			try {
				let token = (await Notifications.getExpoPushTokenAsync()).data;
				console.log(token);
				db.collection("users").doc(this.state.docId).update({
					push_token: token,
				});
			} catch (error) {
				console.log(error);
			}
		}
	};

	fetchUserImage = () => {
		var storageRef = firebase
			.storage()
			.ref()
			.child("user_profiles/" + this.state.userId);

		storageRef
			.getDownloadURL()
			.then((url) => {
				this.setState({
					pfpUrl: url,
				});
			})
			.catch((error) => {
				console.log(error.code);
				this.setState({ pfpUrl: "#" });
			});
	};

	getAllPublicMessages = () => {
		this.unsubscribe = db
			.collection("messages")
			.where("target", "==", "all")
			.orderBy("created_at")
			.onSnapshot((snapshot) => {
				var messages = [];
				snapshot.forEach((doc) => {
					messages.push(doc.data());
				});
				this.setState({
					allMessages: messages,
				});
			});
		console.log(this.unsubscribe);
	};

	getUserName() {
		db.collection("users")
			.where("email", "==", this.state.userId)
			.get()
			.then(async (querySnapshot) => {
				querySnapshot.forEach((doc) => {
					this.setState({
						userName: doc.data().user_name,
						docId: doc.id,
					});
				});
				await this.registerForPushNotificationsAsync();
			});
	}

	keyExtractor = (_: any, index: number) => index.toString();

	renderItem = ({ item }) => {
		return (
			<View
				style={
					item.sender_email !== this.state.userId
						? { flexDirection: "row", padding: RFValue(3) }
						: { flexDirection: "row-reverse", padding: RFValue(3) }
				}
			>
				<Avatar
					source={{
						uri: item.url,
					}}
					rounded
					size={RFValue(70)}
					title={item.sender_name.charAt(0).toUpperCase()}
				/>
				<View>
					<Text style={{ fontWeight: "bold", fontSize: RFValue(20) }}>
						{item.sender_name}
					</Text>
					<View>
						<Text
							style={
								item.sender_email !== this.state.userId
									? styles.messagePopupConatiner
									: styles.alsoMessagePopupConatiner
							}
						>
							{item.message.toString()}
						</Text>
					</View>
				</View>
			</View>
		);
	};

	sendMessage = (message: string) => {
		db.collection("messages")
			.add({
				created_at: firebase.firestore.FieldValue.serverTimestamp(),
				message: message,
				sender_name: this.state.userName,
				sender_email: this.state.userId,
				target: "all",
				url: this.state.pfpUrl,
			})
			.then(() => {
				this.inputRef.clear();
				this.listRef.scrollToEnd({ animated: true });
			});
	};

	componentDidMount() {
		this.getAllPublicMessages();
		this.fetchUserImage();
		this.getUserName();
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		return (
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={-165}
				style={{ flex: 1 }}
			>
				<MyDrawerHeader
					title="Public chat"
					onDrawerIconPress={()=>this.props.navigation.openDrawer()}
				/>
				<View style={{ height: "80%", backgroundColor: "#ebebeb" }}>
					{this.state.allMessages.length !== 0 ? (
						<FlatList
							keyExtractor={this.keyExtractor}
							data={this.state.allMessages}
							renderItem={this.renderItem}
							ref={(chatlist) => (this.listRef = chatlist)}
							style={{ flex: 0 }}
						/>
					) : (
						<View
							style={{
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Image
								// @ts-ignore
								source={require("../assets/static-images/sad-bubble.png")}
								width={288}
								height={287}
							/>
							<Text style={{ color: "#9c9c9c" }}>
								Chat activity seems to be pretty dry today...
							</Text>
						</View>
					)}
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						backgroundColor: "#ebebeb",
						justifyContent: "center",
						position: "absolute",
						bottom: 0
					}}
				>
					<TextInput
						style={styles.chatInput}
						placeholder="Type something here..."
						maxLength={128}
						ref={(input) => (this.inputRef = input)}
						onChangeText={(text) =>
							this.setState({
								inputMessage: text,
							})
						}
						value={this.state.inputMessage}
						numberOfLines={1}
						multiline
						passwordRules=""
					/>
					<TouchableOpacity
						onPress={() => {
							if (this.state.inputMessage.trim() !== "") {
								this.sendMessage(this.state.inputMessage);
							}
						}}
					>
						<Icon
							name="paper-plane"
							type="font-awesome"
							reverse
							raised
							size={RFValue(30)}
							color="#80AED7"
						/>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	chatInput: {
		height: RFValue(75),
		borderColor: "gray",
		borderRadius: RFValue(50),
		backgroundColor: "white",
		shadowRadius: 1,
		elevation: 8,
		fontSize: RFValue(20),
		paddingLeft: 10,
		flex: 1
	},
	messagePopupConatiner: {
		backgroundColor: "#80AED7",
		borderBottomLeftRadius: RFValue(15),
		borderBottomRightRadius: RFValue(15),
		borderTopRightRadius: RFValue(15),
		color: "white",
		padding: 5,
		fontSize: RFValue(16),
		maxWidth: 250,
	},
	alsoMessagePopupConatiner: {
		backgroundColor: "#80AED7",
		borderBottomLeftRadius: RFValue(15),
		borderBottomRightRadius: RFValue(15),
		borderTopLeftRadius: RFValue(15),
		color: "white",
		padding: 5,
		fontSize: RFValue(16),
		maxWidth: 250,
	},
});
