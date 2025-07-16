import "react-native-get-random-values";
import { Component } from "react";
import {
	View,
	FlatList,
	KeyboardAvoidingView,
	Text,
	Image,
	Alert,
} from "react-native";
import { AudioPlayer, createAudioPlayer } from "expo-audio";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	query,
	doc,
	FieldValue,
	collection,
	orderBy,
	onSnapshot,
	where,
	getDocs,
	Unsubscribe,
} from "firebase/firestore";

import { auth, fstore } from "../../config";
import { MyStackHeader } from "../../components/UIComponents/MyHeaders";
import { ChatInput } from "../../components/UIComponents/chatInput";
import { RecordingModal } from "../../components/UIComponents/recordingmodal";
import ChatMessageContainer from "../../components/UIComponents/chatMessageContainer";

import type { PrivateChatStackScreenProps } from "../../navigators/types";

interface State {
	inputMessage: string;
	allMessages: (Message | ImageMsg | AudioMsg)[];
	userName: string;
	expoPushToken: string;
	metering?: number;
	recordingModalVisible: boolean;
	duration: number;
	progress: number;
	pfp: "#" | string;
	modalState: "recording" | "sending" | "fail";
}

interface Message {
	created_at: FieldValue;
	looked: boolean;
	message: string;
	sender_email: string;
}

interface ImageMsg {
	created_at: FieldValue;
	looked: boolean;
	media: string[];
	media_type: "image";
	sender_email: string;
	sender_name: string;
}

interface AudioMsg {
	created_at: FieldValue;
	looked: boolean;
	media: "audio";
	profile_url: string;
	sender_email: string;
}

export class PrivateChat extends Component<
	PrivateChatStackScreenProps<"Chat">,
	State
> {
	recievedSound: AudioPlayer;
	listRef: FlatList<Message | ImageMsg | AudioMsg> | null;
	onSnap: Unsubscribe;
	currentUserId: string;
	otherUserId: string;
	otherUserName: string;

	constructor(props: PrivateChatStackScreenProps<"Chat">) {
		super(props);
		this.state = {
			inputMessage: "",
			allMessages: [],
			userName: "",
			expoPushToken: this.details.push_token,
			metering: -120,
			recordingModalVisible: false,
			duration: 0,
			progress: 0,
			pfp: "#",
			modalState: "recording",
		};
		this.otherUserName = this.details.user_name;
		this.otherUserId = this.details.email;
		this.currentUserId =
			auth.currentUser !== null && auth.currentUser.email
				? auth.currentUser.email
				: "";
		this.recievedSound;
		this.listRef;
	}

	private details = this.props.route.params.details;

	loadRecievedSound = () => {
		const sound = createAudioPlayer(require("../../assets/sounds/recieve.mp3"));

		this.recievedSound = sound;
	};

	getAllPrivateMessages = () => {
		const docId =
			this.otherUserId > this.currentUserId
				? this.currentUserId + "-" + this.otherUserId
				: this.otherUserId + "-" + this.currentUserId;
		const dq = doc(fstore, "chat_sessions", docId);
		const cq = collection(dq, "messages");
		const q = query(cq, orderBy("created_at"));

		this.onSnap = onSnapshot(
			q,
			(snapshot) => {
				snapshot.docChanges().forEach((change) => {
					if (
						change.type === "added" &&
						change.doc.data().email !== this.currentUserId
					) {
						this.recievedSound.play();
					}
				});
				let message: any[] = [];
				snapshot.forEach((doc) => {
					console.log(doc.data());
					message.push({ ...doc.data(), docId: doc.id });
				});
				this.setState({
					allMessages: message,
				});
			},
			(error) => {
				Alert.alert("Something went wrong", error.message);
			}
		);
	};

	async getUserName() {
		const q = query(
			collection(fstore, "users"),
			where("email", "==", this.currentUserId)
		);
		await getDocs(q).then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				this.setState({
					userName: doc.data().user_name,
					pfp: doc.data().profile_url,
				});
			});
		});
	}

	keyExtractor = (_: any, index: number) => index.toString();

	renderItem = ({ item }) => {
		const { navigation } = this.props;
		return (
			<ChatMessageContainer
				item={item}
				navigation={navigation}
				currentUserId={this.currentUserId}
			/>
		);
	};

	componentDidMount() {
		this.loadRecievedSound();
		this.getAllPrivateMessages();
		this.getUserName();
	}

	componentWillUnmount() {
		if (this.recievedSound) {
			this.recievedSound.remove();
		}
		this.onSnap();
	}

	render() {
		return (
			<SafeAreaProvider>
				<RecordingModal
					visible={this.state.recordingModalVisible}
					onCancel={() =>
						this.setState({
							recordingModalVisible: false,
						})
					}
					currentUserId={this.currentUserId}
					otherUserId={this.otherUserId}
				/>
				<KeyboardAvoidingView
					behavior="padding"
					keyboardVerticalOffset={-165}
					style={{ flex: 1 }}
				>
					<MyStackHeader
						title={this.otherUserName}
						onBackPress={() => this.props.navigation.goBack()}
					/>
					<View
						style={{
							height: "80%",
							backgroundColor: "#ebebeb",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{/* {this.state.allMessages.length !== 0 ? ( */}
						<FlatList
							style={{ flex: 1 }}
							keyExtractor={this.keyExtractor}
							data={this.state.allMessages}
							renderItem={this.renderItem}
							ListEmptyComponent={
								<View
									style={{
										flex: 1,
										justifyContent: "center",
										alignItems: "center",
										borderWidth: 1,
									}}
								>
									<Image
										source={require("../../assets/static-images/sad-bubble.png")}
										width={288}
										height={287}
									/>
									<Text style={{ color: "#9c9c9c" }}>
										Chat activity seems to be pretty dry today...
									</Text>
								</View>
							}
							ref={(ref) => {
								this.listRef = ref;
							}}
						/>
					</View>
					<ChatInput
						expoPushToken={this.state.expoPushToken}
						otherUserId={this.otherUserId}
						userName={this.state.userName}
						navigation={this.props.navigation}
						onRecord={() =>
							this.setState({
								recordingModalVisible: true,
							})
						}
					/>
				</KeyboardAvoidingView>
			</SafeAreaProvider>
		);
	}
}
