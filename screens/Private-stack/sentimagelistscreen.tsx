import { TouchableOpacity, View, FlatList, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { SharedElement } from "react-navigation-shared-element";

import { MyStackHeader } from "../../components/UIComponents/MyHeaders";

import type { PrivateChatStackScreenProps } from "../../navigators/types";

interface Props {
	route: any;
	navigation: any
}

interface State {
	images: { url: string }[];
	senderName: string
}

export function SentImgList() {
	const navigation = useNavigation<PrivateChatStackScreenProps<'List'>['navigation']>();
	const route = useRoute<PrivateChatStackScreenProps<'List'>['route']>();

	const images = route.params.images;
	const senderName = route.params.senderName;

	const keyExtractor = (_: any, index: number) => index.toString();

	const renderItem = ({ item, index }: { item: any, index: number }) => (
		<TouchableOpacity
			style={{ paddingVertical: 5 }}
			onPress={() => {
				navigation.navigate("View", {
					image: images[index],
					senderName: senderName,
				});
			}}
		>
			{/* <SharedElement id={`img-list-${index}`}> */}
			<Image
				source={{ uri: item }}
				style={{ height: RFValue(200) }}
				loadingIndicatorSource={require("../../assets/static-images/loading-spinner.gif")}
			/>
			{/* </SharedElement> */}
		</TouchableOpacity>
	);

	return (
		<View>
			<FlatList
				ListHeaderComponent={<MyStackHeader
					title={senderName}
					onBackPress={() => navigation.goBack()}
				/>
				}
				keyExtractor={keyExtractor}
				data={images}
				renderItem={renderItem}
				stickyHeaderIndices={[0]}
			/>
		</View>
	);
}
