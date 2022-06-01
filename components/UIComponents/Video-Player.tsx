import * as React from "react";
import {
	View,
	StyleSheet,
	Text,
	Pressable,
	TouchableWithoutFeedback,
	ActivityIndicator,
  ViewStyle
} from "react-native";
import { Video } from "expo-av";
import { FontAwesome as FAIcon } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { AVPlaybackSource } from "expo-av/build/AV";

interface Props {
	source: AVPlaybackSource;
	videoContainerStyle?: ViewStyle;
	topHeaderComponent?: JSX.Element;
}

export default function VideoPlayer({
	source,
	videoContainerStyle,
	topHeaderComponent,
}: Props) {
	const video = React.useRef<Video>(null);
	const [status, setStatus] = React.useState<any>();
	const [overlayPressable, setOverlayPressable] = React.useState(true);

	function formatTimeString(time: number) {
		let msecs: number | string = time % 1000;

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

		let formatted = `${hours >= 1 ? (hours < 10 ? 0 : "" + hours + ":") : ""}${
			minutes < 10 ? 0 : ""
		}${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;

		return formatted;
	}

	return (
		<View style={[videoContainerStyle, styles.container]}>
			<View style={videoContainerStyle}>
				<>
					<Video
						ref={video}
						style={{
							...StyleSheet.absoluteFillObject,
							backgroundColor: "black",
						}}
						source={source}
						useNativeControls={false}
						resizeMode="contain"
						onPlaybackStatusUpdate={(dt) => {
							setStatus(dt);
						}}
					/>
					<TouchableWithoutFeedback
						onPress={() => setOverlayPressable(!overlayPressable)}
						style={{ flex: 1 }}
						touchSoundDisabled
					>
						{overlayPressable ? (
							<View style={styles.overlayContainer}>
								{topHeaderComponent ?? null}
								<View
									style={{
										margin: 0,
										alignSelf: "center",
										top: "45%",
									}}
								>
									<Pressable
										onPress={() =>
											status.isPlaying
												? video.current.pauseAsync()
												: video.current.playAsync()
										}
										disabled={status.isBuffering}
										android_ripple={{
											color: "rgba(255,255,255,0.5)",
											radius: 30,
										}}
										style={{ padding: 15 }}
									>
										{status.isPlaying ? (
											status.isBuffering ? (
												<ActivityIndicator color="whitesmoke" size={65} />
											) : (
												<FAIcon name="pause" color="whitesmoke" size={35} />
											)
										) : (
											<FAIcon name="play" color="whitesmoke" size={35} />
										)}
									</Pressable>
								</View>
								<View style={styles.bottomBarContainer}>
									<View
										style={{
											flexDirection: "row",
											paddingHorizontal: 10,
											justifyContent: "space-between",
										}}
									>
										<Text style={styles.numberColor}>
											{formatTimeString(status.positionMillis)}
										</Text>
										<Text style={styles.numberColor}>
											{formatTimeString(status.durationMillis)}
										</Text>
									</View>
									<Slider
										maximumValue={status.durationMillis}
										onSlidingComplete={(val) => {
											video.current.setPositionAsync(Math.floor(val));
										}}
										value={status.positionMillis}
										tapToSeek
										style={{ flex: 1 }}
										minimumTrackTintColor="red"
										thumbTintColor="red"
										maximumTrackTintColor="gray"
									/>
								</View>
							</View>
						) : (
							<View style={{ flex: 1 }} />
						)}
					</TouchableWithoutFeedback>
				</>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ecf0f1",
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	overlayContainer: {
		flex: 1,
		backgroundColor: "rgba(0,0,0, 0.35)",
	},
	bottomBarContainer: {
		position: "absolute",
		bottom: 0,
		padding: 10,
		justifyContent: "space-between",
		width: "100%",
	},
	numberColor: {
		color: "whitesmoke",
	},
});
