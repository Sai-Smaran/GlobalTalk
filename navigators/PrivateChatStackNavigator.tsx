import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SearchUser } from "../screens/Private-stack/searchuserscreen";
import { PrivateChat } from "../screens/Private-stack/privatechatscreen";
import { AboutUserScreen } from "../screens/Private-stack/aboutuserscreen";
import { ConfirmSendImage } from "../screens/Private-stack/confirmsendimagescreen";
import { EditImageScreen } from "../screens/Private-stack/editimagescreen";
import { SentImgList } from "../screens/Private-stack/sentimagelistscreen";
import { ImageView } from "../screens/Private-stack/imageviewscreen";
import { ConfirmSendVideoScreen } from "../screens/Private-stack/confirmsendvideoscreen";
import { PrivateChatStackParamList } from "./types";

const Stack = createNativeStackNavigator<PrivateChatStackParamList>();

export function PrivateChatStackNavigator() {
	return (
		<Stack.Navigator
			id={undefined}
			initialRouteName="Search"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen component={SearchUser} name="Search" />
			<Stack.Screen component={PrivateChat} name="Chat" />
			<Stack.Screen component={AboutUserScreen} name="About" />
			<Stack.Screen component={ConfirmSendImage} name="Confirm" />
			<Stack.Screen component={EditImageScreen} name="Edit" />
			<Stack.Screen component={SentImgList} name="List" />
			<Stack.Screen component={ImageView} name="View" />
			<Stack.Screen component={ConfirmSendVideoScreen} name="Confirm_Video" />
		</Stack.Navigator>
	);
}
