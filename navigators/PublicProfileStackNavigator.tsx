import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PublicChat } from "../screens/publicchatscreen";
import { AboutUserScreen } from "../screens/Private-stack/aboutuserscreen";
import { PublicChatStackParamList } from "./types";

const Stack = createNativeStackNavigator<PublicChatStackParamList>();

export function PublicChatStackNavigator() {
  return (
    <Stack.Navigator id={undefined}
      initialRouteName="Public"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={PublicChat} name="Public" />
      <Stack.Screen component={AboutUserScreen} name="AboutUser" />
    </Stack.Navigator>
  );
}
