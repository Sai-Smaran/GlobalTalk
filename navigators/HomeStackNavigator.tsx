import LoginScreen from "../screens/Login-Stack/loginscreen";
import SignUpScreen from "../screens/Login-Stack/signupscreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "./types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
	return (
		<Stack.Navigator id={undefined}
			initialRouteName="Login"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="SignUp" component={SignUpScreen} />
		</Stack.Navigator>
	);
}
