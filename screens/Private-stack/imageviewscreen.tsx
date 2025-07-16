import { useCallback, useState } from "react";
import {
	View,
	TouchableOpacity,
	Text,
	Dimensions,
	Image,
	StyleSheet,
} from "react-native";
import { setStatusBarHidden } from "expo-status-bar";
import { setBackgroundColorAsync, setPositionAsync } from "expo-navigation-bar";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { RFValue } from "react-native-responsive-fontsize";
// import { SharedElement } from "react-navigation-shared-element";
import { Icon } from "@rneui/base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import type { PrivateChatStackScreenProps } from "../../navigators/types";

export function ImageView() {
	const navigation = useNavigation<PrivateChatStackScreenProps<'View'>['navigation']>();
	const route = useRoute<PrivateChatStackScreenProps<'View'>['route']>();

	const image = route.params.image;
	const senderName = route.params.senderName;
	const [imageWidth, setImageWidth] = useState(0);
	const [imageHeight, setImageHeight] = useState(0);

	useFocusEffect(
		useCallback(() => {
			onMount();
			return () => onUnmount();
		}, [])
	);

	async function onMount() {
		console.log("[ImageViewScreen.tsx] -> ", senderName)
		Image.getSize(image, (w, h) => {
			setImageWidth(w);
			setImageHeight(h);
		});

		setStatusBarHidden(true, "slide");
		if (Dimensions.get("window").width < 1024) {
			await setPositionAsync("absolute");
			await setBackgroundColorAsync("transparent");
		}
	}

	async function onUnmount() {
		setStatusBarHidden(false, "slide");
		await setPositionAsync("relative");
		await setBackgroundColorAsync("black");
	}

	return (
		<SafeAreaProvider>
			<View style={styles.container}>
				<Header senderName={senderName} onPressGoBack={() => navigation.goBack()} />
				<ReactNativeZoomableView
					initialZoom={1}
					bindToBorders
					maxZoom={30}
					contentWidth={imageWidth}
					contentHeight={imageHeight}
					style={{ width: 1000 }}
				>
					<Image
						style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
						source={{ uri: image }}
					/>
				</ReactNativeZoomableView>
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		justifyContent: 'center',
		alignItems: 'center',
	},
});

function Header({ senderName, onPressGoBack }: { onPressGoBack: () => void; senderName: string }) {
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				width: "100%",
				backgroundColor: "#01010169",
				padding: 20,
				position: "absolute",
				zIndex: 2,
				top: 0
			}}
		>
			<View style={{ flexDirection: "row" }}>
				<TouchableOpacity onPress={onPressGoBack}>
					<Icon name="arrow-back" color="white" size={RFValue(35)} />
				</TouchableOpacity>
				<Text
					style={{
						color: "white",
						fontSize: RFValue(20),
						marginLeft: RFValue(10),
						fontFamily: "sans-serif-medium",
						textAlignVertical: "center"
					}}
				>
					{senderName}
				</Text>
			</View>
		</View>
	);
}