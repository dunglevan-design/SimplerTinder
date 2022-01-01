import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "tailwind-rn";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

type props = {
  title: string;
  callEnabled: boolean;
};
const ChatHeader = ({ title, callEnabled, navigation, whiteBackground}) => {
  return (
    <View style={[tw("relative w-full items-center py-4 flex-row px-5"), {backgroundColor: whiteBackground ? "#fff" : "rgba(0,0,0,0)"}]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Octicons name="chevron-left" size={36} color="rgba(232, 40, 95, 1)" />
      </TouchableOpacity>
      <Text style={[tw("font-bold text-2xl text-black px-5")]}>{title}</Text>
      {callEnabled && (
        <TouchableOpacity style = {[tw("rounded-full bg-red-200 p-2 absolute right-5")]}>
          <Ionicons name="call" size={24} color="rgba(232, 40, 95, 1)" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatHeader;
