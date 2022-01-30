import React, { Component } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	KeyboardAvoidingView,
	Text,
	Image,
	Alert,
	Dimensions,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config";
import firebase from "firebase";
import MyStackHeader from "../components/MyHeaders/MyStackHeader";
import { decrypt as atob } from "../components/customBase64Encryption";
import { Audio } from "expo-av";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ImageTiles from "../components/UIComponents/imagetiles";
import ChatInput from "../components/UIComponents/chatInput";
import RecordingModal from "../components/UIComponents/recordingmodal";
import ChatAudioPlayer from "../components/UIComponents/chataudioplayer";

export default class PrivateChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUserId: firebase.auth().currentUser.email,
			inputMessage: "",
			allMessages: [],
			userName: "",
			otherUserId: this.details.email,
			otherUserName: this.details.user_name,
			expoPushToken: this.details.push_token,
			recieved: false,
			record: null,
			metering: -120,
			recordingModalVisible: false,
			duration: 0,
			width: Dimensions.get("window").width,
			progress: 0,
			pfp: "#",
			modalState: "recording",
		};
		this.record = undefined;
		this.unsub = null;
		this.recievedSound;
		this.inputRef = null;
		this.listRef = null;
	}

	details = this.props.route.params.details;

	startRecordAudio = async () => {
		if (this.record !== undefined) {
			this.record = undefined;
		}
		console.log("Starting recording");
		const { status: existingStatus } = await Audio.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Audio.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus === "denied") {
			Alert.alert(
				"Unable to record audio",
				"Audio recording permissions are required to record your voice"
			);
			return;
		}
		try {
			const { recording: audioRecording } = await Audio.Recording.createAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			this.record = audioRecording;
			this.setState({
				recordingModalVisible: true,
			});
			audioRecording.setProgressUpdateInterval(16);
			audioRecording.setOnRecordingStatusUpdate(
				({ metering, isRecording, durationMillis,  }) => {
					if (isRecording) {
						this.setState({
							metering: metering,
							duration: durationMillis,
						});
					}
				}
			);
		} catch (e) {
			console.log("something went wrong: " + e);
		}
	};

	stopAndSendRecordAudio = async () => {
		if (this.record !== undefined) {
			console.log("Stopping recording");
			await this.record.stopAndUnloadAsync();
			const uri = this.record.getURI();
			console.log("You may find your beautiful voice here: " + uri);
			this.setState({
				modalState: "sending",
			});
			await this.sendRecording(uri);
			this.record = undefined;
		}
	};

	stopRecordAudio = async () => {
		if (this.record !== undefined) {
			console.log("Stopping recording");
			await this.record.stopAndUnloadAsync();
			this.record = undefined;
		}
		this.setState({
			recordingModalVisible: false,
		});
	};

	sendRecording = async (uri) => {
		const response = await fetch(uri);
		const blob = await response.blob();
		const randomId = uuid();
		const docId =
			this.state.otherUserId > this.state.currentUserId
				? this.state.currentUserId + "-" + this.state.otherUserId
				: this.state.otherUserId + "-" + this.state.currentUserId;

		const storageRef = firebase.storage().ref();

		const uploadTask = storageRef.child("shared_media/" + randomId).put(blob);

		uploadTask.on(
			firebase.storage.TaskEvent.STATE_CHANGED,
			(snap) => {
				const uploadProgress = snap.bytesTransferred / snap.totalBytes;
				this.setState({ progress: uploadProgress });
			},
			(err) => {
				console.log(
					`Something went wrong while sending voice message: ${err.message} /nError code: ${err.code}`
				);
				this.setState({
					modalState: "fail",
				});
			},
			() => {
				uploadTask.snapshot.ref.getDownloadURL().then((url) => {
					db.collection("chat_sessions")
						.doc(docId)
						.collection("messages")
						.add({
							created_at: firebase.firestore.FieldValue.serverTimestamp(),
							media: url,
							media_type: "audio",
							sender_email: this.state.currentUserId,
							profile_url: this.state.pfp,
						})
						.then(() => {
							setTimeout(() => {
								this.setState({
									recordingModalVisible: false,
									modalState: "recording",
								});
							}, 5000);
						});
				});
			}
		);
	};

	loadRecievedSound = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("../assets/sounds/recieve.mp3")
		);

		this.recievedSound = sound;
	};

	getAllPrivateMessages = () => {
		const docId =
			this.state.otherUserId > this.state.currentUserId
				? this.state.currentUserId + "-" + this.state.otherUserId
				: this.state.otherUserId + "-" + this.state.currentUserId;
		this.unsub = db
			.collection("chat_sessions")
			.doc(docId)
			.collection("messages")
			.orderBy("created_at")
			.onSnapshot(
				(snapshot) => {
					snapshot.docChanges().forEach(async (change) => {
						if (
							change.type === "added" &&
							change.doc.data().email !== this.state.currentUserId
						) {
							await this.recievedSound.playAsync();
						}
					});
					var message = [];
					snapshot.forEach((doc) => {
						message.push(doc.data());
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

	getUserName() {
		db.collection("users")
			.where("email", "==", this.state.currentUserId)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					this.setState({
						userName: doc.data().user_name,
						pfp: doc.data().profile_url,
					});
				});
			});
	}

	keyExtractor = (item, index) => index.toString();

	renderItem = ({ item }) => {
		const { navigation } = this.props;
		return (
			<View
				style={
					item.sender_email !== this.state.currentUserId
						? { flexDirection: "row", paddingVertical: RFValue(2.5) }
						: { flexDirection: "row-reverse", paddingVertical: RFValue(2.5) }
				}
			>
				{!item.media ? (
					<View>
						<Text
							style={
								item.sender_email !== this.state.currentUserId
									? styles.messagePopupConatiner
									: styles.alsoMessagePopupConatiner
							}
						>
							{atob(item.message)}
						</Text>
					</View>
				) : item.media_type === "image" ? (
					<View
						style={
							item.sender_email !== this.state.currentUserId
								? [styles.messagePopupConatiner, { maxWidth: RFValue(350) }]
								: [styles.alsoMessagePopupConatiner, { maxWidth: RFValue(350) }]
						}
					>
						<ImageTiles navigation={navigation} item={item} />
					</View>
				) : item.media_type === "audio" ? (
					<View
						style={
							item.sender_email !== this.state.currentUserId
								? [styles.messagePopupConatiner, { maxWidth: RFValue(350) }]
								: [styles.alsoMessagePopupConatiner, { maxWidth: RFValue(350) }]
						}
					>
						<ChatAudioPlayer item={item} />
					</View>
				) : null}
			</View>
		);
	};

	async componentDidMount() {
		await this.loadRecievedSound();
		this.getAllPrivateMessages();
		this.getUserName();
		this.dimensionsListener = Dimensions.addEventListener(
			"change",
			({ window }) => {
				this.setState({
					width: window.width,
				});
			}
		);
	}

	async componentWillUnmount() {
		if (this.recievedSound) {
			await this.recievedSound.unloadAsync();
		}
	}

	render() {
		return (
			<SafeAreaProvider>
				<RecordingModal
					visible={this.state.recordingModalVisible}
					duration={this.state.duration}
					onCancel={async () => await this.stopRecordAudio()}
					onStopRecording={async () => await this.stopAndSendRecordAudio()}
					state={this.state.modalState}
					meter={this.state.metering}
					progress={this.state.progress}
				/>
				<KeyboardAvoidingView
					behavior="padding"
					keyboardVerticalOffset={-165}
					style={{ flex: 1 }}
				>
					<MyStackHeader
						title={this.state.otherUserName}
						navigation={this.props.navigation}
					/>
					<View style={{ height: "80%", backgroundColor: "#ebebeb" }}>
						{this.state.allMessages.length !== 0 ? (
							<FlatList
								keyExtractor={this.keyExtractor}
								data={this.state.allMessages}
								renderItem={this.renderItem}
								ref={(ref) => {
									ref !== null ? (this.listRef = ref) : (this.listRef = null);
								}}
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
					<ChatInput
						expoPushToken={this.state.expoPushToken}
						otherUserId={this.state.otherUserId}
						userName={this.state.userName}
						navigation={this.props.navigation}
						onRecord={async () => await this.startRecordAudio()}
					/>
				</KeyboardAvoidingView>
			</SafeAreaProvider>
		);
	}
}

const styles = StyleSheet.create({
	messagePopupConatiner: {
		backgroundColor: "#80AED7",
		borderBottomLeftRadius: RFValue(15),
		borderBottomRightRadius: RFValue(15),
		borderTopRightRadius: RFValue(15),
		color: "white",
		padding: RFValue(5),
		fontSize: RFValue(16),
		maxWidth: RFValue(300),
	},
	alsoMessagePopupConatiner: {
		backgroundColor: "#80AED7",
		borderBottomLeftRadius: RFValue(15),
		borderBottomRightRadius: RFValue(15),
		borderTopLeftRadius: RFValue(15),
		color: "white",
		padding: RFValue(5),
		fontSize: RFValue(16),
		maxWidth: RFValue(300),
	},
});
