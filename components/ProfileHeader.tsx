import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useUserInfo } from "../hooks/useUserInfo";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { utils } from "@react-native-firebase/app";
import ChatHeader from "./ChatHeader";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { uid } from "uid";


const ProfileHeader = ({ pickImage, navigation, scrollToEditInfo, setSettingsModalVisible }) => {
  const { userInfo } = useUserInfo();
  // console.log(userInfo);

  return (
    <>
      <ChatHeader
        title={"Profile"}
        callEnabled={false}
        navigation={navigation}
        whiteBackground={true}
      />
      <View
        style={[
          tw("bg-white items-center py-6 mb-6"),
          {
            left: "-25%",
            height: 450,
            width: "150%",
            borderBottomLeftRadius: 300,
            borderBottomRightRadius: 300,
            paddingLeft: "20%",
            paddingRight: "20%",
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
          <Settings setSettingsModalVisible={setSettingsModalVisible}/>
          <Addmedia userInfo={userInfo} pickImage={pickImage} />
          <EditInfo scrollToEditInfo={scrollToEditInfo} />
        </View>
      </View>
    </>
  );
};

const Avatar = ({ userinfo }) => {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      //upload image to bucket
      const reference = storage().ref(`${userinfo.id}/${uid()}`);
      //@ts-ignore
      const task = reference.putFile(result.uri);

      task.on("state_changed", (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
        );
      });

      task.then(async () => {
        console.log("Image uploaded to the bucket!");
        const url = await reference.getDownloadURL();
        //update userinfo on firebase
        firestore().collection("users").doc(userinfo.id).set({
          ...userinfo,
          photoURL: url
        })
      });
    }
  };
  return (
    <>
      <TouchableOpacity onPress={() => pickImage() }>
        <Image
          source={{ uri: userinfo?.photoURL }}
          style={tw("w-40 h-40 rounded-full")}
        />
      </TouchableOpacity>
      <Text style={tw("font-bold text-2xl text-center py-2")}>
        {userinfo?.fullName}, {userinfo?.age}
      </Text>
    </>
  );
};

const Addmedia = ({ userInfo, pickImage }) => {
  return (
    <View style={[tw("items-center"), { transform: [{ translateY: 30 }] }]}>
      <TouchableOpacity
        onPress={pickImage}
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

const Settings = ({setSettingsModalVisible}) => {
  return (
    <View style={tw("items-center")}>
      <TouchableOpacity
      onPress={() => setSettingsModalVisible(true)}
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

const EditInfo = ({ scrollToEditInfo }) => {
  return (
    <View style={tw("items-center")}>
      <TouchableOpacity
        onPress={() => scrollToEditInfo()}
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
