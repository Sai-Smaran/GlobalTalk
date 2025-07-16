import { Header } from "@rneui/base";
import { Icon } from "@rneui/base";

interface DrawerHeaderProps {
	/*
	 *Title of the header
	 */
	title: string;
	/**
	 *Callback triggered when pressed the drawer button
	 */
	onDrawerIconPress: () => void;
}

interface StackHeaderProps {
	/*
	 *Title of the header
	 */
	title: string;
	/**
	 *Callback triggered when pressed the back button
	 */
	onBackPress: () => void;
}

function MyDrawerHeader({ title, onDrawerIconPress }: DrawerHeaderProps) {
	return (
		<Header
			placement="left"
			leftComponent={
				<Icon
					name="menu"
					type="entypo"
					color="white"
					size={30}
					onPress={onDrawerIconPress}
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

function MyStackHeader({ onBackPress, title }: StackHeaderProps) {
	return (
		<Header
			leftComponent={
				<Icon
					name="arrow-back-ios"
					type="material"
					color="white"
					onPress={onBackPress}
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
