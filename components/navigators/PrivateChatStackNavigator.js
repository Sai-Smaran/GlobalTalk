import React from "react"
import SearchUser from "../../screens/searchuserscreen";
import PrivateChat from "../../screens/privatechatscreen";
import AboutUser from "../../screens/aboutuserscreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConfirmSendImage from "../../screens/confirmsendimagescreen";
import EditImageScreen from "../../screens/editimagescreen";
import SentImgList from "../../screens/sentimagelistscreen";
import ImageView from "../../screens/imageviewscreen";

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
