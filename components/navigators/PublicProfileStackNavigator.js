import React from "react";
import PublicChat from "../../screens/publicchatscreen";
import AboutUserScreen from "../../screens/aboutuserscreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function PublicChatStackNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName="Public"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={PublicChat} name="Public" />
      <Stack.Screen component={AboutUserScreen} name="AboutUser" />
    </Stack.Navigator>
  );
}
