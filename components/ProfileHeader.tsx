import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useUserInfo } from "../hooks/useUserInfo";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';

const ProfileHeader = () => {
  const {userInfo} = useUserInfo();
  // console.log(userInfo);

  return (
    <View
      style={[
        tw("bg-white items-center py-6"),
        {
          left: "-25%",
          height: 450,
          width: "150%",
          borderBottomLeftRadius: 300,
          borderBottomRightRadius: 300,
          paddingLeft: "20%", paddingRight: "20%"
        },
      ]}
    >
      <Avatar userinfo={userInfo} />
      {/* Controls */}
      <View
        style={[
          tw(
            "mt-6 relative flex flex-row items-center justify-evenly w-full"
          ),
        ]}
      >
        <Settings />
        <Addmedia />
        <EditInfo />
      </View>
    </View>
  );
};

const Avatar = ({ userinfo }) => {
  return (
    <>
      <Image
        source={{ uri: userinfo?.photoURL }}
        style={tw("w-40 h-40 rounded-full")}
      />
      <Text style={tw("font-bold text-2xl text-center py-2")}>
        {userinfo?.fullName}, {userinfo?.age}
      </Text>
    </>
  );
};

const Addmedia = (props) => {
  return (
    <View style={[tw("items-center"), {transform : [{translateY: 30}]}]}>
      <TouchableOpacity
        style={[
          tw("h-16 w-16 rounded-full justify-center items-center"),
          { backgroundColor: "#fe5642" },
        ]}
      >
        <Ionicons name="ios-camera" size={34} color="white" />
        <View
          style={[
            tw(
              "absolute bottom-0 right-0 h-5 w-5 bg-white rounded-full justify-center items-center"
            ),
            styles.shadow,
          ]}
        >
          <Feather
            style={[tw("absolute")]}
            name="plus"
            size={15}
            color="#fe5642"
          />
        </View>
      </TouchableOpacity>

      <Text style={tw("text-sm font-semibold text-center")}>ADD MEDIA</Text>
    </View>
  );
};

const Settings = (props) => {
  return (
    <View style={tw("items-center")}>
      <TouchableOpacity
        style={[
          tw("h-14 w-14 rounded-full justify-center items-center"),
          { backgroundColor: "#e8eaef" },
        ]}
      >
        <MaterialIcons name="settings" size={24} color="black" />
      </TouchableOpacity>

      <Text style={tw("text-sm font-semibold text-center")}>SETTINGS</Text>
    </View>
  );
};

const EditInfo = (props) => {
  return (
    <View style={tw("items-center")}>
      <TouchableOpacity
        style={[
          tw("h-14 w-14 rounded-full justify-center items-center"),
          { backgroundColor: "#e8eaef" },
        ]}
      >
        <FontAwesome name="pencil" size={24} color="black" />
      </TouchableOpacity>

      <Text style={tw("text-sm font-semibold text-center")}>EDIT INFO</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 8,
  },
});

export default ProfileHeader;
