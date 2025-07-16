import type {
	CompositeScreenProps,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DrawerScreenProps } from '@react-navigation/drawer';

export type RootStackParamList = {
	Drawer: undefined;
	Stack: undefined;
};

export type HomeStackParamList = {
	Login: undefined;
	SignUp: undefined;
}

export type DrawerNavigationParamList = {
	Public: undefined;
	Private: undefined;
	UserInfoEdit: undefined;
}

export type PublicChatStackParamList = {
	Public: undefined;
	AboutUser: {
		details: {
			profile_url: string;
			user_name: string;
			about: string;
			email: string;
		}
	}
}

export type PrivateChatStackParamList = {
	Search: undefined;
	Chat: {
		details: {
			profile_url: string;
			user_name: string;
			about: string;
			email: string;
			push_token: string;
		}
	};
	About: {
		details: {
			profile_url: string;
			user_name: string;
			about: string;
			email: string;
		}
	};
	Confirm: {
		imageUrls: { uri: string }[],
		senderId: string,
		pushToken: string,
	};
	Edit: {
		image: string
	};
	List: {
		images: string[],
		senderName: string,
	};
	View: {
		image: string;
		senderName: string;
	};
	Confirm_Video: {
		media: string
	}
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, T>;

export type LoginStackScreenProps<T extends keyof HomeStackParamList> =
	CompositeScreenProps<NativeStackScreenProps<HomeStackParamList, T>, NativeStackScreenProps<RootStackParamList>>

export type DrawerStackScreenProps<T extends keyof DrawerNavigationParamList> = CompositeScreenProps<
	DrawerScreenProps<DrawerNavigationParamList, T>,
	NativeStackScreenProps<RootStackParamList>
>

export type PublicChatStackScreenProps<T extends keyof PublicChatStackParamList> =
	CompositeScreenProps<NativeStackScreenProps<PublicChatStackParamList, T>, CompositeScreenProps<
		DrawerScreenProps<DrawerNavigationParamList>,
		NativeStackScreenProps<RootStackParamList>
	>>

export type PrivateChatStackScreenProps<T extends keyof PrivateChatStackParamList> =
	CompositeScreenProps<NativeStackScreenProps<PrivateChatStackParamList, T>, CompositeScreenProps<
		DrawerScreenProps<DrawerNavigationParamList>,
		NativeStackScreenProps<RootStackParamList>
	>>

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList { }
	}
}
