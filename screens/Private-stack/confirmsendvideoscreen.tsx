import React from "react";
import { View, Text } from "react-native";
import VideoPlayer from "../../components/UIComponents/Video-Player";

export default function ConfirmSendVideoScreen({navigation, route}) {

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<VideoPlayer source={{uri: route.params.imageUrls}} />
		</View>
	);
}
