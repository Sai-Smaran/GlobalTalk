import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function ImageTiles({ navigation, item }) {
  switch (item.media.length) {
    case 1:
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{ padding: 2.5 }}
            onPress={() =>
              navigation.navigate("List", {
                images: item.media,
                senderName: item.sender_name,
              })
            }
          >
            <Image
              source={{ uri: item.media[0] }}
              style={{
                width: RFValue(300),
                height: RFValue(300),
                borderRadius: 20,
              }}
            />
          </TouchableOpacity>
        </View>
      );
      break;
    case 2:
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[0] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(300),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[1] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(300),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
      break;
    case 3:
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[0] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[1] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[2] }}
                style={{
                  width: RFValue(300),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
      break;
    case 4:
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[0] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[1] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[2] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[3] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
      break;
    default:
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[0] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[1] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <Image
                source={{ uri: item.media[2] }}
                style={{
                  width: RFValue(150),
                  height: RFValue(150),
                  borderRadius: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 2.5 }}
              onPress={() =>
                navigation.navigate("List", {
                  images: item.media,
                  senderName: item.sender_name,
                })
              }
            >
              <View
                style={{
                  borderRadius: 20,
                  height: RFValue(150),
                }}
              >
                <Image
                  source={{ uri: item.media[3] }}
                  style={{
                    width: RFValue(150),
                    height: RFValue(150),
                    borderRadius: 20,
                  }}
                />
                <View
                  style={{
                    height: RFValue(150),
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    bottom: RFValue(150),
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: RFValue(40),
                        fontWeight: "bold",
                      }}
                    >{`+${item.media.length - 4}`}</Text>
                    <Text style={{ color: "white", fontSize: RFValue(18) }}>
                      {item.media.length - 4 > 1 ? `more images` : `more image`}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
      break;
  }
}
