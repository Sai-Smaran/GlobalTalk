import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	StyleSheet,
	useWindowDimensions,
} from "react-native";
import React from "react";
import Waves from "./waves";
import { RFValue } from "react-native-responsive-fontsize";
import CircularProgress from "./circular-progress";

export default function RecordingModal({
	visible,
	meter,
	duration,
	onCancel,
	state,
	progress,
	onStopRecording,
}) {
	const { width } = useWindowDimensions();

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
		formatted = `${hours < 10 ? 0 : ""}${hours}:${
			minutes < 10 ? 0 : ""
		}${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;

		return formatted;
	}

	return (
		<Modal
			transparent
			visible={visible}
			collapsable
			onRequestClose={onCancel}
			animationType="fade"
		>
			<View
				style={{
					flex: 1,
					backgroundColor: "rgba(0, 0, 0, 0.6)",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{state === "recording" ? (
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
							<Waves loudness={meter} />
						</View>
						<View style={{ alignItems: "center", marginLeft: 50 }}>
							<Text
								style={{
									marginTop: 50,
									fontSize: RFValue(20),
									color: "gray",
								}}
							>
								{formatTimeString(duration)}
							</Text>
							<TouchableOpacity
								onPress={onStopRecording}
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
				) : state === "sending" ? (
					<View style={styles.mainModal}>
						<CircularProgress progress={progress} maxCount={1} />
						<Text style={{ fontSize: RFValue(20), color: "darkgray" }}>
							{progress === 1 ? "Uploaded Images" : "Uploading images"}
						</Text>
					</View>
				) : null}
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
