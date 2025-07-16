import { useEvent } from "expo";
import {
	View,
	StyleSheet,
	Text,
	Pressable,
	TouchableWithoutFeedback,
	ActivityIndicator,
	ViewStyle,
} from "react-native";
import { VideoView, useVideoPlayer, VideoSource } from "expo-video";
import { FontAwesome as FAIcon } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { JSX, useState } from "react";

interface Props {
	source: VideoSource;
	videoContainerStyle?: ViewStyle;
	topHeaderComponent?: JSX.Element;
}

export function VideoPlayer({
	source,
	videoContainerStyle,
	topHeaderComponent,
}: Props) {
	const player = useVideoPlayer(source, (plr) => plr.play());
	const [overlayPressable, setOverlayPressable] = useState(true);

	const { isPlaying } = useEvent(player, "playingChange", {
		isPlaying: player.playing,
	});

	const { status } = useEvent(player, "statusChange", {
		status: player.status,
	});

	const { currentTime } = useEvent(player, "timeUpdate", {
		currentTime: player.currentTime,
		bufferedPosition: player.bufferedPosition,
		currentLiveTimestamp: player.currentLiveTimestamp,
		currentOffsetFromLive: player.currentLiveTimestamp,
	});

	const { duration } = useEvent(player, "sourceLoad", {
		duration: player.duration,
		availableAudioTracks: player.availableAudioTracks,
		availableSubtitleTracks: player.availableSubtitleTracks,
		availableVideoTracks: player.availableVideoTracks,
		videoSource: source,
	});

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
					<VideoView player={player}>
						<TouchableWithoutFeedback
							onPress={() => setOverlayPressable((prev) => !prev)}
							style={{ flex: 1 }}
							touchSoundDisabled
						>
							{overlayPressable ?? (
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
											onPress={
												() => {}
												// status.isPlaying
												// 	? video.current.pauseAsync()
												// 	: video.current.playAsync()
											}
											disabled={status === "loading"}
											android_ripple={{
												color: "rgba(255,255,255,0.5)",
												radius: 30,
											}}
											style={{ padding: 15 }}
										>
											{status !== "loading" ? (
												isPlaying ? (
													<FAIcon name="pause" color="whitesmoke" size={35} />
												) : (
													<FAIcon name="play" color="whitesmoke" size={35} />
												)
											) : (
												<ActivityIndicator color="whitesmoke" size={65} />
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
												{formatTimeString(currentTime)}
											</Text>
											<Text style={styles.numberColor}>
												{formatTimeString(duration)}
											</Text>
										</View>
										<Slider
											maximumValue={duration}
											onSlidingComplete={(val) => {
												// video.current.setPositionAsync(Math.floor(val));
											}}
											value={duration}
											tapToSeek
											style={{ flex: 1 }}
											minimumTrackTintColor="red"
											thumbTintColor="red"
											maximumTrackTintColor="gray"
										/>
									</View>
								</View>
							)}
						</TouchableWithoutFeedback>
					</VideoView>
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
