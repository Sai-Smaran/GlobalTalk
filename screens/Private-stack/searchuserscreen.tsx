import React, { Component } from "react";
import { View, FlatList, Platform, Dimensions } from "react-native";
import { SearchBar, ListItem, Avatar } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import { MyDrawerHeader } from "../../components/UIComponents/MyHeaders"
import db from "../../config";
import firebase from "firebase";

interface Props {
  navigation: any
}

interface State {
  userId: string
  search: string
  allResults: any[]
}

export default class SearchUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      search: "",
      allResults: [],
    };
  }

  getUsers = () => {
    db.collection("users")
      .where(
        "searchable_keywords",
        "array-contains",
        this.state.search.trim().toLowerCase()
      )
      .get()
      .then((query) => {
        var searchResults = [];
        query.forEach((doc) => {
          searchResults.push(doc.data());
        });
        this.setState({
          allResults: searchResults,
        });
      });
  };

  keyExtractor = (_, index: number) => index.toString();

  aboutShortener = (message: string) => {
    let charLen = Math.round(Dimensions.get("window").width / 13);
    console.log(charLen);
    if (message.length > charLen) {
      return message.slice(0, charLen - 3) + "...";
    } else {
      return message;
    }
  };

  renderItem = ({ item }) => (
    <ListItem
      onPress={() => {
          this.props.navigation.navigate("Chat", {
            details: item,
          });
      }}
      onLongPress={() =>
        this.props.navigation.navigate("About", { details: item })
      }
    >
      <Avatar
        rounded
        source={{ uri: item.profile_url }}
        title={item.user_name.charAt(0).toUpperCase()}
        size={RFValue(60)}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "bold", fontSize: RFValue(20) }}>
          {item.user_name}
        </ListItem.Title>
        <ListItem.Subtitle>
          {item.about ? this.aboutShortener(item.about) : ""}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron color="#ededed" size={50} />
    </ListItem>
  );

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#ededed" }}>
        <MyDrawerHeader
          title="Private chat"
          navigation={this.props.navigation}
        />
        <SearchBar
          platform="android"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          value={this.state.search}
          onChangeText={(text) => this.setState({ search: text })}
          placeholder="Search"
          onSubmitEditing={() => {
            this.getUsers();
          }}
          returnKeyType="search"
          onClear={() => this.setState({ allResults: [] })}
        />
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.allResults}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
