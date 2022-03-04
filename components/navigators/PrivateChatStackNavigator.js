import React from "react"
import SearchUser from "../../screens/Private-stack/searchuserscreen";
import PrivateChat from "../../screens/Private-stack/privatechatscreen";
import AboutUser from "../../screens/Private-stack/aboutuserscreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConfirmSendImage from "../../screens/Private-stack/confirmsendimagescreen";
import EditImageScreen from "../../screens/Private-stack/editimagescreen";
import SentImgList from "../../screens/Private-stack/sentimagelistscreen";
import ImageView from "../../screens/Private-stack/imageviewscreen";

const Stack = createNativeStackNavigator();

export default function PrivateChatStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={SearchUser} name="Search" />
      <Stack.Screen component={PrivateChat} name="Chat" />
      <Stack.Screen component={AboutUser} name="About" />
      <Stack.Screen component={ConfirmSendImage} name="Confirm" />
      <Stack.Screen component={EditImageScreen} name="Edit" />
      <Stack.Screen component={SentImgList} name="List" />
      <Stack.Screen component={ImageView} name="View" />
    </Stack.Navigator>
  );
}
