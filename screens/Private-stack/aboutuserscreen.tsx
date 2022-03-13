import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import { MyStackHeader } from "../../components/UIComponents/MyHeaders";

interface Props {
	route: any
	navigation: any
}

interface State {
	userName: string
	imageLink: string
	about: string
}

export default class AboutUserScreen extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			userName: this.props.route.params.details.user_name,
			imageLink: this.props.route.params.details.profile_url,
			about: this.props.route.params.details.about,
		};
	}

	render() {
		return (
			<View
				style={{
					backgroundColor: "#ededed",
					height: "100%",
					alignItems: "center",
				}}
			>
				<MyStackHeader
					title={`Profile - ${this.state.userName}`}
					navigation={this.props.navigation}
				/>
				<View style={styles.nameAvatarContainer}>
					<Avatar
						rounded
						source={
							this.state.imageLink
								? { uri: this.state.imageLink }
								: { uri: "#" }
						}
						title={this.state.userName.charAt(0).toUpperCase()}
						size={RFValue(100)}
					/>
					<Text style={styles.userName}>{this.state.userName}</Text>
				</View>
				<View style={{ width: "90%", marginTop: 20 }}>
					<Text style={{ fontWeight: "bold", fontSize: 20 }}>About</Text>
					<Text style={styles.aboutBox}>{this.state.about}</Text>
				</View>
			</View>
		);
	}
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
