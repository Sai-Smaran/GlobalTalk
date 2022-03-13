import React from "react";
import { Header } from "react-native-elements";
import { Icon } from "react-native-elements";

interface DrawerHeaderProps {
	title: string;
	navigation: any;
}

interface StackHeaderProps {
	navigation: any;
	title: string;
}

function MyDrawerHeader({ navigation, title }: DrawerHeaderProps) {
	return (
		<Header
			placement="left"
			leftComponent={
				<Icon
					name="menu"
					type="entypo"
					color="white"
					size={30}
					onPress={() => navigation.openDrawer()}
				/>
			}
			centerComponent={{
				text: title,
				style: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },
			}}
			backgroundColor="#666666"
		/>
	);
}

function MyStackHeader({ navigation, title }: StackHeaderProps) {
	return (
		<Header
			leftComponent={
				<Icon
					name="arrow-back-ios"
					type="material"
					color="white"
					onPress={() => navigation.goBack()}
				/>
			}
			centerComponent={{
				text: title,
				style: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },
			}}
			backgroundColor="#666666"
		/>
	);
}

export { MyDrawerHeader, MyStackHeader };
