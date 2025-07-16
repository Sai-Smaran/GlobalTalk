import { useCallback, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Avatar } from "@rneui/base";
import { signOut } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, where, query, getDocs } from "firebase/firestore";
import { Icon } from "@rneui/base";
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import { RFValue } from "react-native-responsive-fontsize";
import { auth, store, fstore } from "../config";

const deviceTypeMap = {
	[DeviceType.UNKNOWN]: "unknown",
	[DeviceType.PHONE]: "phone",
	[DeviceType.TABLET]: "tablet",
	[DeviceType.DESKTOP]: "desktop",
	[DeviceType.TV]: "tv",
};

export function CustomSideBarMenu(props: DrawerContentComponentProps) {
	const [image, setimage] = useState("#");
	const [userName, setUserName] = useState("");
	const [currentDeviceType, setCurrentDeviceType] = useState("");

	const userId = auth.currentUser !== null && auth.currentUser.email !== null ? auth.currentUser.email : "";

	function fetchImage(imageName: string) {
		const storageRef = ref(store, "user_profiles/" + imageName);

		getDownloadURL(storageRef)
			.then((url: string) => {
				setimage(url);
			})
			.catch((error) => {
				setimage("#");
				console.log(error.code);
			});
	}

	async function getUserProfile() {
		const q = query(collection(fstore, "users"), where("email", "==", userId));
		await getDocs(q).then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				setUserName(data.user_name);
			});
		});
	}

	useFocusEffect(
		useCallback(() => {
			fetchImage(userId);
			getUserProfile();
			getDeviceTypeAsync().then((dev) => {
				setCurrentDeviceType(deviceTypeMap[dev]);
			});
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
					titleStyle={{ color: "black" }}

					size={
						currentDeviceType === "tablet" || currentDeviceType === "desktop"
							? width >= 1024
								? "large"
								: "xlarge"
							: width >= 480
								? "small"
								: "large"
					}
					title={image === "#" && userName.charAt(0).toUpperCase()}
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
						signOut(auth);
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
