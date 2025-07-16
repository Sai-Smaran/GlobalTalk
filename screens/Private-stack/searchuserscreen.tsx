import { useState } from "react";
import { View, FlatList } from "react-native";
import { SearchBar, ListItem, Avatar } from "@rneui/base";
import { RFValue } from "react-native-responsive-fontsize";
import { query, collection, where, getDocs, limit } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import { MyDrawerHeader } from "../../components/UIComponents/MyHeaders";
import { fstore } from "../../config";

import type { PrivateChatStackScreenProps } from "../../navigators/types";

export function SearchUser() {
	const [search, setSearch] = useState<string>("");
	const [allResults, setAllResults] = useState<any[]>([]);
	const navigation = useNavigation<PrivateChatStackScreenProps<'Search'>['navigation']>()

	const getUsers = () => {
		const q = query(
			collection(fstore, "users"),
			where(
				"searchable_keywords",
				"array-contains",
				search
			),
			limit(20)
		);
		getDocs(q)
			.then((query) => {
				let searchResults = [];
				query.forEach((doc) => {
					searchResults.push(doc.data());
				});
				setAllResults(searchResults)
			});
	};

	const keyExtractor = (_, index: number) => index.toString();

	const renderItem = ({ item }: {
		item: {
			profile_url: string;
			user_name: string;
			about: string;
			email: string;
			push_token: string;
		}
	}) => (
		<ListItem
			onPress={() => {
				navigation.navigate("Chat", {
					details: item,
				});
			}}
			onLongPress={() =>
				navigation.navigate("About", { details: item })
			}
		>
			<Avatar
				rounded
				source={{ uri: item.profile_url }}
				titleStyle={{ color: "black" }}
				title={item.profile_url === "#" && item.user_name.charAt(0).toUpperCase()}
				size={RFValue(60)}
			/>
			<ListItem.Content>
				<ListItem.Title style={{ fontWeight: "bold", fontSize: RFValue(20) }}>
					{item.user_name}
				</ListItem.Title>
				<ListItem.Subtitle ellipsizeMode="tail">
					{item.about}
				</ListItem.Subtitle>
			</ListItem.Content>
			<ListItem.Chevron color="#ededed" size={50} />
		</ListItem>
	);

	return (
		<View style={{ flex: 1, backgroundColor: "#ededed" }}>
			<MyDrawerHeader
				title="Private chat"
				onDrawerIconPress={() => navigation.openDrawer()}
			/>
			<FlatList
				ListHeaderComponent={
					<SearchBar
						platform="android"
						autoCapitalize="none"
						autoCorrect={false}
						clearButtonMode="while-editing"
						value={search}
						key="search"
						onChangeText={(text) => setSearch(() => text.trim().toLowerCase())}
						placeholder="Search"
						onSubmitEditing={() =>
							getUsers()
						}
						returnKeyType="search"
						onClear={() => setAllResults([])}
					/>}
				keyExtractor={keyExtractor}
				data={allResults}
				renderItem={renderItem}
				stickyHeaderIndices={[0]}
				stickyHeaderHiddenOnScroll
			/>
		</View>
	);
}
