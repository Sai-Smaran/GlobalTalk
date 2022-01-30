import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Avatar } from "react-native-elements";
import firebase from "firebase";
import db from "../../config";
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";

export default class CustomSideBarMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: "vijayagiriramya2008@gmail.com",
			image: "#",
			userName: "",
			docId: "",
			width: 0,
		};
	}

	fetchImage = (imageName) => {
		var storageRef = firebase
			.storage()
			.ref()
			.child("user_profiles/" + imageName);

		storageRef
			.getDownloadURL()
			.then((url) => {
				this.setState({ image: url });
			})
			.catch((error) => {
				this.setState({ image: "#" });
				console.log(error.code);
			});
	};

	getUserProfile() {
		db.collection("users")
			.where("email", "==", this.state.userId)
			.onSnapshot((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					var data = doc.data();
					this.setState({
						userName: data.user_name,
						docId: doc.id,
					});
				});
			});
	}

	componentDidMount() {
		this.fetchImage(this.state.userId);
		this.getUserProfile();
	}

	render() {
		const { width } = Dimensions.get("window");
		return (
			<View style={{ flex: 1 }}>
				<View
					style={[
						{
							flex: 0.4,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "#32867d",
							flexDirection: width >= 1024 ? "row" : "column",
						},
					]}
				>
					<Avatar
						rounded
						source={{
							uri: this.state.image,
						}}
						size={width >= 1024 ? "large" : "xlarge"}
						showEditButton
						title={this.state.userName.charAt(0).toUpperCase()}
					/>

					<Text
						style={{
							fontWeight: "bold",
							fontSize: RFValue(20),
							color: "#fff",
							padding: RFValue(10),
						}}
					>
						Hello {this.state.userName}!
					</Text>
				</View>
				<DrawerContentScrollView {...this.props} style={{ flex: 0.6 }}>
					<DrawerItemList {...this.props} />
				</DrawerContentScrollView>
				<View style={{ flex: 0.1 }}>
					<TouchableOpacity
						style={{
							flexDirection: "row",
							width: "100%",
							height: "100%",
						}}
						onPress={() => {
							firebase
								.auth()
								.signOut()
								.then(() => {
									this.props.navigation.navigate("Stack");
								});
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
}
