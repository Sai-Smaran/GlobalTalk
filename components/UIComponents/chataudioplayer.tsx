import { useEffect } from "react";
import {
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import {
	useAudioPlayer,
	useAudioPlayerStatus,
	useAudioSampleListener,
} from "expo-audio";
import { RFValue } from "react-native-responsive-fontsize";
import { Avatar, Icon } from "@rneui/base";

type ChatAudioPlayerProps = {
	item: {
		media: string;
		profile_url: string;
	};
};

export default function ChatAudioPlayer({ item }: ChatAudioPlayerProps) {
	const audioPlayer = useAudioPlayer({ uri: item.media }, 100);
	const audioStatus = useAudioPlayerStatus(audioPlayer);
	useAudioSampleListener(audioPlayer, (samp) => {
		if (audioPlayer.isAudioSamplingSupported) {
			console.log(`[${samp.timestamp}] -> ${samp.channels}`);
		}
	});

	function playAudio() {
		try {
			// Reached the end of the audio clip, now play the audio from the beginning
			if (audioPlayer.currentTime === audioStatus.duration) {
				audioPlayer.seekTo(0);
			}
			audioPlayer.play();
		} catch (e) {
			console.warn(e);
		}
	}

	function pauseAudio() {
		try {
			audioPlayer.pause();
		} catch (e) {
			console.warn(e);
		}
	}

	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			<View
				style={{
					height: RFValue(50),
					width: RFValue(50),
					justifyContent: "flex-end",
					alignItems: "flex-end",
				}}
			>
				<Avatar
					source={{ uri: item.profile_url }}
					avatarStyle={{
						...StyleSheet.absoluteFillObject,
						width: RFValue(50),
						height: RFValue(50),
						borderRadius: 250,
					}}
				/>
				<Icon
					name="mic"
					iconStyle={{
						backgroundColor: "whitesmoke",
						borderRadius: 20,
					}}
				/>
			</View>
			{!audioPlayer.isBuffering ? (
				audioStatus.playing ? (
					<TouchableOpacity
						style={{ padding: 20 }}
						onPress={() => pauseAudio()}
					>
						<Icon
							name={"pause"}
							type="font-awesome-5"
							size={RFValue(25)}
							color="whitesmoke"
						/>
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={{ padding: 20 }} onPress={() => playAudio()}>
						<Icon
							name={"play"}
							type="font-awesome-5"
							size={RFValue(25)}
							color="whitesmoke"
						/>
					</TouchableOpacity>
				)
			) : (
				<ActivityIndicator size={20} />
			)}
		</View>
	);
}
