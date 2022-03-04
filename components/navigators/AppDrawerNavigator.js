import React from "react";
import { Icon } from "react-native-elements";
import { useWindowDimensions, StyleSheet } from "react-native";
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaProvider } from "react-native-safe-area-context";

import PrivateChatStackNavigator from "./PrivateChatStackNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import UserInfoEditingScreen from "../../screens/userinfoeditscreen";
import PublicChat from "../../screens/publicchatscreen";

const Drawer = createDrawerNavigator();

export default function AppDrawerNavigator() {
	const [currentDeviceType, setcurrentDeviceType] = React.useState("");
	const { width } = useWindowDimensions();

	const deviceTypeMap = {
		[DeviceType.UNKNOWN]: "unknown",
		[DeviceType.PHONE]: "phone",
		[DeviceType.TABLET]: "tablet",
		[DeviceType.DESKTOP]: "desktop",
		[DeviceType.TV]: "tv",
	};

	React.useEffect(async () => {
		await getDeviceTypeAsync().then((dev) => {
			setcurrentDeviceType(deviceTypeMap[dev]);
		});
	}, []);

	return (
		<Drawer.Navigator
			initialRouteName="Public"
			drawerContent={(props) => <CustomSideBarMenu {...props} />}
			screenOptions={{
				headerShown: false,
				drawerType:
					currentDeviceType === "tablet" ||
					currentDeviceType === "desktop"
						? width >= 1024
							? "permanent"
							: "slide"
						: width >= 480
						? "permanent"
						: "slide",
				drawerLabelStyle: styles.labelStyles,
			}}
		>
			<Drawer.Screen
				options={{
					drawerLabel: "Public Chat",
					drawerIcon: () => (
						<Icon name="users" type="font-awesome-5" size={RFValue(20)} />
					),
				}}
				name="Public"
				component={PublicChat}
			/>
			<Drawer.Screen
				name="Private"
				options={{
					drawerLabel: "Private Chat",
					drawerIcon: () => (
						<Icon
							name="user-friends"
							type="font-awesome-5"
							size={RFValue(20)}
						/>
					),
				}}
				component={PrivateChatStackNavigator}
			/>
			<Drawer.Screen
				name="UserInfoEdit"
				options={{
					drawerLabel: "Edit your profile",
					drawerIcon: () => (
						<Icon name="user-edit" type="font-awesome-5" size={RFValue(20)} />
					),
				}}
				component={UserInfoEditingScreen}
			/>
		</Drawer.Navigator>
	);
}

const styles = StyleSheet.create({
	labelStyles: {
		fontFamily: "sans-serif",
		fontWeight: "700",
		fontSize: 19,
		marginLeft: -15,
	},
});
