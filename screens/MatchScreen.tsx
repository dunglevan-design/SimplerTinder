import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import tw from "tailwind-rn";

const MatchScreen = ({ route, navigation }) => {
  const { userInfo, currentCard } = route.params;

  return (
    <View style={[tw("flex-1 bg-gray-900 pt-20"), { opacity: 0.89 }]}>
      <View style={tw("justify-center px-5 pt-20")}>
        <Image
          source={{
            uri: "https://links.papareact.com/mg9",

          }}
          resizeMethod="resize"
          resizeMode="contain"
          style= {{width: "100%", height: 80}}
        ></Image>
        
      </View>

      <Text style={tw("text-white text-center mt-5")}>
        You and {currentCard.fullName} have liked each other.
      </Text>

      <View style={tw("flex-row justify-evenly mt-5")}>
        <Image
          source={{ uri: userInfo.photoURL }}
          style={tw("h-32 w-32 rounded-full")}
        />
        <Image
          source={{ uri: currentCard.photoURL }}
          style={tw("h-32 w-32 rounded-full")}
        />
      </View>

      <TouchableOpacity
        style={[tw("w-3/4 px-10 py-6 rounded-full mt-20 items-center justify-center"), {backgroundColor: "rgba(232, 40, 95, 1)", marginLeft: "12.5%"}]}
        onPress={() => {
          navigation.goBack();
          navigation.navigate("Chat");
        }}
      >
        <Text style = {tw("text-2xl font-bold text-white")}>Send a message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchScreen;
