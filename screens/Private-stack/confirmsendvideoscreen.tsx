import { View } from "react-native";
import { useRoute } from "@react-navigation/native";

import { VideoPlayer } from "../../components/UIComponents/Video-Player";

import type { PrivateChatStackScreenProps } from "../../navigators/types";

export function ConfirmSendVideoScreen() {
	const route = useRoute<PrivateChatStackScreenProps<'Confirm_Video'>['route']>();

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<VideoPlayer source={{ uri: route.params.media }} />
		</View>
	);
}
