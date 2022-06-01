import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

interface ChatAudioPlayerProps {
	item: {
		media: string;
		profile_url: string;
	};
}

export default function ChatAudioPlayer({ item }: ChatAudioPlayerProps) {
	const [playbackObj] = useState(new Audio.Sound());
	const [soundObj, setSoundObj] = useState(null);
	const [currentAudio, setCurrentAudio] = useState("#");

	async function handleAudio() {
		if (!soundObj) {
			playbackObj.loadAsync({ uri: item.media }, { shouldPlay: true });
			setCurrentAudio(item.media);
			console.log(soundObj);
		}
		if (soundObj!.isPlaying!) {
			const status = await playbackObj.pauseAsync();
			setSoundObj(status);
		}
		if (
			soundObj.isLoaded &&
			!soundObj.isPlaying &&
			currentAudio === item.media
		) {
			const status = await playbackObj.playAsync();
			setSoundObj(status);
		}
		if (soundObj.didJustFinish) {
			playbackObj.unloadAsync();
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
				<Image
					source={{ uri: item.profile_url }}
					style={{
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
			<TouchableOpacity
				style={{ padding: 20 }}
				onPress={async () => {
					await handleAudio();
				}}
			>
				<Icon
					name={
						soundObj
							? soundObj.isPlaying
								? soundObj.didJustFinish
									? "play"
									: "pause"
								: "play"
							: "play"
					}
					type="font-awesome-5"
					size={RFValue(25)}
					color="whitesmoke"
				/>
			</TouchableOpacity>
		</View>
	);
}
