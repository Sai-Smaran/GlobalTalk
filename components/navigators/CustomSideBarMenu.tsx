import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	useWindowDimensions,
} from "react-native";
import { Avatar } from "react-native-elements";
import firebase from "firebase";
import db from "../../config";
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import {
	DrawerDescriptorMap,
	DrawerNavigationHelpers,
} from "@react-navigation/drawer/lib/typescript/src/types";
import { useFocusEffect } from "@react-navigation/native";

interface Props {
	children?: React.ReactNode;
	state: any;
	descriptors: DrawerDescriptorMap;
	navigation: DrawerNavigationHelpers;
}

const deviceTypeMap = {
	[DeviceType.UNKNOWN]: "unknown",
	[DeviceType.PHONE]: "phone",
	[DeviceType.TABLET]: "tablet",
	[DeviceType.DESKTOP]: "desktop",
	[DeviceType.TV]: "tv",
};

export default function CustomSideBarMenu(props: Props) {
	const [userId] = useState(firebase.auth().currentUser.email);
	const [image, setimage] = useState("#");
	const [userName, setUserName] = useState(""),
		[docId, setDocId] = useState(""),
		[currentDeviceType, setCurrentDeviceType] = useState("");

	function fetchImage(imageName: string) {
		const storageRef = firebase
			.storage()
			.ref()
			.child("user_profiles/" + imageName);

		storageRef
			.getDownloadURL()
			.then((url: string) => {
				setimage(url);
			})
			.catch((error) => {
				setimage("#");
				console.log(error.code);
			});
	}

	function getUserProfile() {
		db.collection("users")
			.where("email", "==", userId)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					setUserName(data.user_name);
					setDocId(doc.id);
				});
			});
	}

	useFocusEffect(
		React.useMemo(() => {
			fetchImage(userId);
			getUserProfile();
			getDeviceTypeAsync().then((dev) => {
				setCurrentDeviceType(deviceTypeMap[dev]);
			});
			return () => {};
		}, [])
	);

	const { width } = useWindowDimensions();
	return (
		<View style={{ flex: 1 }}>
			<View
				style={[
					{
						flex: 0.4,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#32867d",
						flexDirection:
							currentDeviceType === "tablet" || currentDeviceType === "desktop"
								? width >= 1024
									? "row"
									: "column"
								: width >= 480
								? "row"
								: "column",
					},
				]}
			>
				<Avatar
					rounded
					source={{
						uri: image,
					}}
					size={
						currentDeviceType === "tablet" || currentDeviceType === "desktop"
							? width >= 1024
								? "large"
								: "xlarge"
							: width >= 480
							? "small"
							: "large"
					}
					title={userName.charAt(0).toUpperCase()}
				/>

				<Text
					style={{
						fontWeight: "bold",
						fontSize: RFValue(25),
						color: "#fff",
						padding: RFValue(10),
					}}
				>
					Hello {userName}!
				</Text>
			</View>
			<DrawerContentScrollView {...props} style={{ flex: 0.6 }}>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
			<View
				style={{
					flex: 0.1,
					borderTopWidth: 1,
					borderTopColor: "#696969",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<TouchableOpacity
					style={{
						flexDirection: "row",
						width: "100%",
						height: "100%",
						justifyContent: "flex-start",
						alignItems: "center",
					}}
					onPress={() => {
						firebase.auth().signOut();
					}}
				>
					<Icon
						name="logout"
						type="antdesign"
						size={RFValue(40)}
						iconStyle={{ paddingLeft: RFValue(10) }}
					/>

					<Text
						style={{
							fontSize: RFValue(25),
							fontWeight: "bold",
							marginLeft: RFValue(30),
						}}
					>
						Log Out
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
