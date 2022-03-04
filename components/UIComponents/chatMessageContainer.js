import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { decrypt as atob } from "../customBase64Encryption";
import ChatAudioPlayer from "./chataudioplayer";
import ImageTiles from "./imagetiles";

export default function ChatMessageContainer({
	item,
	navigation,
	currentUserId,
}) {

	return (
		<View
			style={
				item.sender_email !== currentUserId
					? { flexDirection: "row", paddingVertical: RFValue(2.5) }
					: { flexDirection: "row-reverse", paddingVertical: RFValue(2.5) }
			}
		>
			<View
				style={
					item.sender_email !== currentUserId
						? styles.messagePopupConatiner
						: styles.alsoMessagePopupConatiner
				}
			>
				{!item.media ? (
					<Text
						style={{
							fontSize: RFValue(16),
							color: "white",
						}}
					>
						{atob(item.message)}
					</Text>
				) : item.media_type === "image" ? (
					<ImageTiles navigation={navigation} item={item} />
				) : item.media_type === "audio" ? (
					<ChatAudioPlayer item={item} />
				) : null}
				<View
					style={{
						alignItems: "flex-end",
						width: "100%",
					}}
				>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	messagePopupConatiner: {
		backgroundColor: "#80AED7",
		borderBottomLeftRadius: RFValue(15),
		borderBottomRightRadius: RFValue(15),
		borderTopRightRadius: RFValue(15),
		padding: RFValue(5),
		maxWidth: RFValue(350),
	},
	alsoMessagePopupConatiner: {
		backgroundColor: "#80AED7",
		borderBottomLeftRadius: RFValue(15),
		borderBottomRightRadius: RFValue(15),
		borderTopLeftRadius: RFValue(15),
		padding: RFValue(5),
		maxWidth: RFValue(350),
	},
});
