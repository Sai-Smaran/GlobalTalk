import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	StyleSheet,
	useWindowDimensions,
	Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { v4 as uuid } from "uuid";
import Waves from "./waves";
import CircularProgress from "./circular-progress";
import { fstore, store } from "../../config";
import { getDownloadURL, ref, StorageError, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { RecordingPresets, useAudioRecorder, AudioModule, useAudioRecorderState } from "expo-audio";
import * as IntentLauncher from "expo-intent-launcher";
import { useState } from "react";

type RecordingModalProps = {
	visible: boolean;
	onCancel: () => void;
	currentUserId: string;
	otherUserId: string;
}

export function RecordingModal({
	visible,
	onCancel,
	currentUserId,
	otherUserId
}: RecordingModalProps) {
	const audioRecorder = useAudioRecorder({ ...RecordingPresets.LOW_QUALITY, isMeteringEnabled: true });
	const recorderState = useAudioRecorderState(audioRecorder, 100)
	const { width } = useWindowDimensions();

	const [progress, setProgress] = useState(0);
	const [modalState, setModalState] = useState<"recording" | "sending" | "fail">('recording');

	async function startRecordAudio() {
		try {
			await audioRecorder.prepareToRecordAsync();
			audioRecorder.record();
		} catch (e) {
			console.warn(e);
		}
	};

	async function stopAndSendRecordAudio() {
		audioRecorder.stop();
		await sendRecording(recorderState.url);
		// if (this.record !== undefined) {
		// 	console.log("Stopping recording");
		// 	await this.record.stopAndUnloadAsync();
		// 	const uri = this.record.getURI();
		// 	console.log("You may find your beautiful voice here: " + uri);
		// 	this.setState({
		// 		modalState: "sending",
		// 	});
		// 	if (uri !== null) {
		// 		await sendRecording(uri);
		// 	}
		// 	this.record = undefined;
		// }
	};

	async function stopRecordAudio() {
		audioRecorder.stop();
		// if (this.record !== undefined) {
		// 	console.log("Stopping recording");
		// 	await this.record.stopAndUnloadAsync();
		// 	this.record = undefined;
		// }
		// this.setState({
		// 	recordingModalVisible: false,
		// });
	};

	async function sendRecording(uri: string) {
		const response = await fetch(uri);
		const blob = await response.blob();
		const randomId = uuid();
		const docId =
			otherUserId > currentUserId
				? currentUserId + "-" + otherUserId
				: otherUserId + "-" + currentUserId;

		const storageRef = ref(store, "shared_media/" + randomId);

		const uploadTask = uploadBytesResumable(storageRef, blob);

		const observer = (snap: UploadTaskSnapshot) => {
			const uploadProgress = snap.bytesTransferred / snap.totalBytes;
			setProgress(uploadProgress);
		};

		const errorHandler = (err: StorageError) => {
			console.log(
				`Something went wrong while sending voice message: ${err.message} /nError code: ${err.code}`
			);

			setModalState("fail");
		};

		const successHandler = () => {
			getDownloadURL(uploadTask.snapshot.ref).then((url) => {
				const dq = doc(fstore, "chat_sessions", docId);
				const cq = collection(dq, "messages");
				addDoc(cq, {
					created_at: serverTimestamp(),
					media: url,
					media_type: "audio",
					looked: false,
					sender_email: this.currentUserId,
					profile_url: this.state.pfp,
				}).then(() => {
					setTimeout(() => {
						unsubscribe();
						setModalState("recording");
					}, 5000);
				});
			});
		}

		let unsubscribe = uploadTask.on(
			"state_changed",
			observer,
			errorHandler,
			successHandler
		);
	};

	async function handlePermissions() {
		const { granted: recordingPermGranted } = await AudioModule.getRecordingPermissionsAsync();
		if (!recordingPermGranted) {
			await AudioModule.requestRecordingPermissionsAsync()
				.then((resp) => {
					if (!resp.granted) {
						Alert.alert(
							"Unable to record audio",
							"Audio recording permissions are required to record your voice",
							[{
								text: "OK",
								onPress: async () => {
									await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_SETTINGS);
								}
							}]
						)
						onRequestClose();
						return;
					}
				});
		}
	}

	async function handleRecordingAsync() {
		await handlePermissions();
		await startRecordAudio()
	}

	function formatTimeString(time: number) {
		let msecs: string | number = time % 1000;

		if (msecs < 10) {
			msecs = `00${msecs}`;
		} else if (msecs < 100) {
			msecs = `0${msecs}`;
		}

		let seconds = Math.floor(time / 1000);
		let minutes = Math.floor(time / 60000);
		let hours = Math.floor(time / 3600000);
		seconds = seconds - minutes * 60;
		minutes = minutes - hours * 60;

		let formatted: string;
		formatted = `${hours < 10 ? 0 : ""}${hours}:${minutes < 10 ? 0 : ""
			}${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;

		return formatted;
	}

	async function onRequestClose() {
		await stopRecordAudio();
		onCancel();
	}

	return (
		<Modal
			transparent
			visible={visible}
			collapsable
			onRequestClose={onRequestClose}
			animationType="fade"
			onShow={async () => {
				await handleRecordingAsync();
			}}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: "rgba(0, 0, 0, 0.6)",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{modalState === "recording" ? (
					<View
						style={[
							styles.mainModal,
							{
								flexDirection: width >= 1024 ? "row" : "column",
							},
						]}
					>
						<View
							style={{
								height: 420,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Waves loudness={recorderState.metering} />
						</View>
						<View style={{ alignItems: "center", marginLeft: 50 }}>
							<Text
								style={{
									marginTop: 50,
									fontSize: RFValue(20),
									color: "gray",
								}}
							>
								{formatTimeString(recorderState.durationMillis)}
							</Text>
							<TouchableOpacity
								onPress={stopAndSendRecordAudio}
								style={styles.stopRecordButton}
							>
								<Text
									style={{
										fontSize: RFValue(20),
										color: "white",
										fontWeight: "bold",
									}}
								>
									Stop recording
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : modalState === "sending" ? (
					<View style={styles.mainModal}>
						<CircularProgress progress={progress} maxCount={1} />
						<Text style={{ fontSize: RFValue(20), color: "darkgray" }}>
							{progress === 1 ? "Uploaded Audio" : "Uploading Audio"}
						</Text>
					</View>
				) : (
					<View style={styles.mainModal}>
						<Text>Error</Text>
					</View>
				)}
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	mainModal: {
		backgroundColor: "white",
		width: "75%",
		height: "75%",
		elevation: 48,
		borderRadius: RFValue(10),
		shadowColor: "black",
		justifyContent: "center",
		alignItems: "center",
	},
	stopRecordButton: {
		marginTop: 50,
		justifyContent: "center",
		alignItems: "center",
		width: RFValue(200),
		height: RFValue(50),
		borderRadius: RFValue(50),
		backgroundColor: "crimson",
	},
});
