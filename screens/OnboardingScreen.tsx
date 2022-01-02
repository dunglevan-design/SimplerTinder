import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { InfoForm } from "../components/InfoForm";
import useAuth from "../hooks/useAuth";
import { UserInfoProvider } from "../hooks/useUserInfo";
import tw from "tailwind-rn";
import { TagSelect } from "react-native-tag-select";
import firestore from "@react-native-firebase/firestore";

const data = [
    { id: 1, label: "Money" },
    { id: 2, label: "Travel" },
    { id: 3, label: "LGBTQ+" },
    { id: 4, label: "INFJ" },
    { id: 5, label: "Bitcoin" },
    { id: 6, label: "Fishing" },
    { id: 7, label: "Football" },
    { id: 8, label: "Outdoor" },
    { id: 9, label: "Indoor" },
    { id: 10, label: "Wine" },
    { id: 11, label: "Basketball" },
    { id: 12, label: "Climbing" },
    { id: 13, label: "Comedy" },
    { id: 14, label: "Cars" },
    { id: 15, label: "Intimate Chat" },
    { id: 16, label: "Swimming" },
    { id: 17, label: "Dancing" },
    { id: 18, label: "Art" },
    { id: 19, label: "Karaoke" },
  ];
const OnboardingScreen = ({ navigation }) => {
  const { user } = useAuth();
  const tag = useRef();
  const [userInfoState, setuserInfoState] = useState({
    fullName: "",
    age: 0,
    occupation: "",
  });

  const SaveUserInfo = () => {
    console.log(">>>>>>>>>>> :", userInfoState);
    firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        fullName: userInfoState.fullName,
        age: userInfoState.age,
        occupation: userInfoState.occupation,
        //@ts-ignore
        tags: (tag?.current?.itemsSelected).map((tag) => tag.label),
      })
      .then(() => {
        Alert.alert("WorseTinder", "User data has been saved successfully");
      });
  };

  return (
    <ScrollView>
      <InfoForm
        userInfo={userInfoState}
        setuserInfoState={setuserInfoState}
        type="fullName"
      />
      <InfoForm
        userInfo={userInfoState}
        setuserInfoState={setuserInfoState}
        type="occupation"
      />
      <InfoForm
        userInfo={userInfoState}
        setuserInfoState={setuserInfoState}
        type="age"
      />
      <Text style={tw("text-xl text-gray-700 px-4 mt-6 font-bold")}>
        Select as many as you want from below
      </Text>
      <View style={{ padding: 10 }}>
        <TagSelect ref={tag} data={data} theme="info" />
      </View>

      <View style={tw("w-full justify-center items-center mt-6 mb-6")}>
        <TouchableOpacity
          onPress={() => SaveUserInfo()}
          style={[
            tw("w-40 justify-center items-center rounded-full"),
            { backgroundColor: "#fe5642" },
          ]}
        >
          <Text style={tw("text-white font-bold text-2xl p-3")}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OnboardingScreen;
