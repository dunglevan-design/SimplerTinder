import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import useAuth from "../hooks/useAuth";
import TinderCard from "react-tinder-card";
import tw from "tailwind-rn";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  return (
    <View style={tw("items-center flex-row justify-between px-5")}>
      {/* HEADER */}
      <View>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user?.photoURL }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
