import { useCallback } from "react";
import { setStatusBarHidden } from "expo-status-bar";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import type { PrivateChatStackScreenProps } from "../../navigators/types";

export function EditImageScreen() {
	const route = useRoute<PrivateChatStackScreenProps<'Edit'>['route']>()
	const imageData = route.params?.image;

	useFocusEffect(useCallback(
		() => {
			setStatusBarHidden(false, "slide");
		}, []))

	return null;
	// <ImageEditor
	//   onCloseEditor={() =>
	//     this.props.navigation.navigate("Confirm", {
	//       imageUrls: this.state.imageData,
	//     })
	//   }
	//   imageUri={this.state.imageData[this.state.editImgNo].uri}
	//   asView
	//   minimumCropDimensions={{ width: 100, height: 100 }}
	//   mode="full"
	//   onEditingComplete={(result) => {
	//     let data = this.state.imageData;
	//     data.splice(this.state.editImgNo, 1, result);
	//     console.log(data);
	//     this.props.navigation.navigate("Confirm", {
	//       imageUrls: data,
	//     });
	//   }}
	// />
}

