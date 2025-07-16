import { Component } from "react";
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
import { Icon } from "@rneui/base";
import { Avatar } from "@rneui/base";
import { RFValue } from "react-native-responsive-fontsize";
import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";
import {
	FieldValue,
	Unsubscribe,
	addDoc,
	collection,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import { auth, fstore, store } from "../config";
import type { PublicChatStackScreenProps } from "../navigators/types";
import { MyDrawerHeader } from "../components/UIComponents/MyHeaders";

Notifications.setNotificationHandler({
	//@ts-ignore
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	}),
});

interface State {
	userId: string | null;
	inputMessage: string;
	allMessages: Message[];
	userName: string;
	pfpUrl: "#" | string;
	docId: string;
}

interface Message {
	created_at: FieldValue;
	looked: boolean;
	message: string;
	sender_email: string;
}

export class PublicChat extends Component<PublicChatStackScreenProps<'Public'>, State> {
	inputRef: TextInput | null;
	listRef: FlatList<Message> | null;
	unsubscribe: Unsubscribe;

	constructor(props: PublicChatStackScreenProps<"Public">) {
		super(props);
		this.state = {
			userId: auth.currentUser === null ? "" : auth.currentUser.email,
			inputMessage: "",
			allMessages: [],
			userName: "",
			pfpUrl: "#",
			docId: "",
		};
		this.unsubscribe;
		this.inputRef;
		this.listRef;
	}

	private registerForPushNotificationsAsync = async () => {
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
				const token = (await Notifications.getExpoPushTokenAsync()).data;
				await updateDoc(
					doc(fstore, "users", this.state.docId), {
					push_token: token,
				});
			} catch (error) {
				console.log(error);
			}
		}
	};

	private fetchUserImage = () => {
		const storageRef = ref(store, "user_profiles/" + this.state.userId);

		getDownloadURL(storageRef)
			.then((url: string) => {
				this.setState({
					pfpUrl: url,
				});
			})
			.catch((error) => {
				console.log(error.code);
				this.setState({ pfpUrl: "#" });
			});
	};

	private getAllPublicMessages = () => {
		const q = query(
			collection(fstore, "messages"),
			where("target", "==", "all"),
			orderBy("created_at")
		);
		this.unsubscribe = onSnapshot(q, (snapshot) => {
			let messages: any[] = [];
			snapshot.forEach((doc) => {
				messages.push(doc.data());
			});
			this.setState({
				allMessages: messages,
			});
		});
	};

	private getUserName() {
		const q = query(
			collection(fstore, "users"),
			where("email", "==", this.state.userId)
		);
		getDocs(q).then(async (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				this.setState({
					userName: doc.data().user_name,
					docId: doc.id,
				});
			});
			await this.registerForPushNotificationsAsync();
		});
	}

	private keyExtractor = (_: any, index: number) => index.toString();

	private renderItem = ({ item }) => {
		return (
			<View
				style={{
					padding: RFValue(3),
					flexDirection:
						item.sender_email !== this.state.userId ? "row" : "row-reverse",
				}}
			>
				<Avatar
					source={{
						uri: item.url,
					}}
					titleStyle={{ color: "black" }}

					rounded
					size={RFValue(70)}
					title={item.url === "#" && item.sender_name.charAt(0).toUpperCase()}
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

	private sendMessage = (message: string) => {
		addDoc(collection(fstore, "messages"), {
			created_at: serverTimestamp(),
			message: message,
			sender_name: this.state.userName,
			sender_email: this.state.userId,
			target: "all",
			url: this.state.pfpUrl,
		}).then(() => {
			this.inputRef && this.inputRef.clear();
			this.listRef && this.listRef.scrollToEnd({ animated: true });
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
					onDrawerIconPress={() => this.props.navigation.openDrawer()}
				/>
				<View style={{ height: "80%", backgroundColor: "#ebebeb" }}>
					{this.state.allMessages.length !== 0 ? (
						<FlatList
							keyExtractor={this.keyExtractor}
							data={this.state.allMessages}
							renderItem={this.renderItem}
							ref={(flatlist) => { this.listRef = flatlist }}
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
						bottom: 0,
					}}
				>
					<TextInput
						style={styles.chatInput}
						placeholder="Type something here..."
						maxLength={128}
						ref={(input) => { this.inputRef = input }}
						onChangeText={(text) =>
							this.setState({
								inputMessage: text,
							})
						}
						value={this.state.inputMessage}
						numberOfLines={1}
						multiline
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
		flex: 1,
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
