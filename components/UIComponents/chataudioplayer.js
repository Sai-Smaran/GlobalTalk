import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default function ChatAudioPlayer({ item }) {
	const [playbackObj] = useState(new Audio.Sound());
	const [soundObj, setSoundObj] = useState(null);
	const [currentAudio, setCurrentAudio] = useState("#");

	async function handleAudio() {
		if (!playbackObj) {
			const sound = playbackObj.loadAsync(
				{ uri: item.media },
				{ shouldPlay: true }
			);
		}
		if (soundObj.isLoaded && soundObj.isPlaying) {
			const status = await playbackObj.setStatusAsync({ shouldPlay: false });
			setSoundObj(status);
		}
		if (
			soundObj.isLoaded &&
			!soundObj.isPlaying &&
			currentAudio === item.media
		) {
			const status = await playbackObj.setStatusAsync({ shouldPlay: true });
			setSoundObj(status);
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
						width: RFValue(50),
						height: RFValue(50),
						borderRadius: 250,
						...StyleSheet.absoluteFill,
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
								? soundObj.didJsutFinish
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
