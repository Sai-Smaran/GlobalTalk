import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "@rneui/base";
import { RFValue } from "react-native-responsive-fontsize";
import { MyStackHeader } from "../../components/UIComponents/MyHeaders";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PrivateChatStackScreenProps } from "../../navigators/types";

export function AboutUserScreen() {
	const navigation = useNavigation<PrivateChatStackScreenProps<'About'>['navigation']>();
	const route = useRoute<PrivateChatStackScreenProps<'About'>['route']>();

	const userName: string = route.params.details.user_name
	const imageLink: string = route.params.details.profile_url
	const about: string = route.params.details.about

	return (
		<View
			style={{
				backgroundColor: "#ededed",
				height: "100%",
				alignItems: "center",
			}}
		>
			<MyStackHeader
				title={`Profile - ${userName}`}
				onBackPress={() => navigation.goBack()}
			/>
			<View style={styles.nameAvatarContainer}>
				<Avatar
					rounded
					source={
						imageLink
							? { uri: imageLink }
							: { uri: "#" }
					}
					titleStyle={{ color: "black" }}

					title={userName.charAt(0).toUpperCase()}
					size={RFValue(100)}
				/>
				<Text style={styles.userName}>{userName}</Text>
			</View>
			<View style={{ width: "90%", marginTop: 20 }}>
				<Text style={{ fontWeight: "bold", fontSize: 20 }}>About</Text>
				<Text style={styles.aboutBox}>{about}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	nameAvatarContainer: {
		marginTop: 15,
		backgroundColor: "#fff",
		elevation: 4,
		flexDirection: "row",
		padding: 5,
		width: "95%",
	},
	userName: {
		fontWeight: "bold",
		fontSize: RFValue(40),
		marginLeft: 25,
	},
	aboutBox: {
		backgroundColor: "white",
		borderWidth: 1.5,
		height: 300,
		padding: 10,
		borderColor: "gray",
		borderRadius: 10,
		elevation: 8,
	},
});
