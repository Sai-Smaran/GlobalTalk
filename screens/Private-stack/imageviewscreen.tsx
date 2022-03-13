import React, { Component } from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	ActivityIndicator,
	Dimensions,
} from "react-native";
import { setStatusBarHidden } from "expo-status-bar";
import { setBackgroundColorAsync, setPositionAsync } from "expo-navigation-bar";
import ImageViewer from "react-native-image-zoom-viewer";
import { RFValue } from "react-native-responsive-fontsize";
// import { SharedElement } from "react-navigation-shared-element";
import { Icon } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Props {
	route: any
	navigation: any
}

interface State {
	images: string[],
	senderName: string
}

export default class ImageView extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			images: this.props.route.params.images,
			senderName: this.props.route.params.senderName,
		};
	}

	async componentDidMount() {
		setStatusBarHidden(true, "slide");
		if (Dimensions.get("window").width < 1024) {
			await setPositionAsync("absolute");
			await setBackgroundColorAsync("transparent");
		}
	}

	async componentWillUnmount() {
		setStatusBarHidden(false, "slide");
		await setPositionAsync("relative");
		await setBackgroundColorAsync("black");
	}

	async componentDidCatch() {
		setStatusBarHidden(false, "slide");
		await setPositionAsync("relative");
		await setBackgroundColorAsync("black");
	}

	renderHeader = () => (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				width: "100%",
				backgroundColor: "#01010169",
				padding: 20,
			}}
		>
			<View style={{ flexDirection: "row" }}>
				<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
					<Icon name="arrow-back" color="white" size={RFValue(35)} />
				</TouchableOpacity>
				<Text
					style={{
						color: "white",
						fontSize: RFValue(20),
						marginLeft: RFValue(10),
						fontFamily: "sans-serif-medium",
					}}
				>
					{this.state.senderName}
				</Text>
			</View>
		</View>
	);

	render() {
		const { navigation } = this.props;
		return (
			<SafeAreaProvider>
				<ImageViewer
					//@ts-ignore
					imageUrls={this.state.images}
					onRequestClose={() => navigation.goBack()}
					visible
					index={this.props.route.params.imgIndex}
					saveToLocalByLongPress={false}
					enableSwipeDown
					useNativeDriver
					loadingRender={() => <ActivityIndicator size="large" color="white" />}
					onSwipeDown={() => navigation.goBack()}
					pageAnimateTime={300}
					flipThreshold={RFValue(60)}
					doubleClickInterval={300}
					renderHeader={() => this.renderHeader()}
					renderImage={(props) => (
						// <SharedElement id={{ ...props.index }}>
							<Image {...props} />
						// </SharedElement>
					)}
					renderIndicator={() => null}
				/>
			</SafeAreaProvider>
		);
	}
}
