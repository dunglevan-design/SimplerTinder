import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-rn";
import ProfileHeader from "../components/ProfileHeader";
import { useUserInfo } from "../hooks/useUserInfo";
import firestore from "@react-native-firebase/firestore";

const Dictionary = {
  fullName: "fullName",
};
const ModalScreen = ({ navigation }) => {
  const { userInfo } = useUserInfo();

  const [userInfoState, setuserInfoState] = useState({
    fullName: "",
    age: 0,
    occupation: "",
    photoURL: "",
  });

  useEffect(() => {
    setuserInfoState({
      ...userInfo,
    });
  }, []);
  
  useEffect(() => {
    navigation.setOptions({
      animation: "slide_from_right",
      animationTypeForReplace: "push",
    });
  }, []);

  const SaveUserInfo = () => {
    console.log(">>>>>>>>>>> :", userInfoState);
    firestore()
      .collection("users")
      .doc(userInfo.id.toString())
      .set({
        fullName: userInfoState.fullName,
        age: userInfoState.age,
        occupation: userInfoState.occupation,
        photoURL: userInfoState.photoURL,
      })
      .then(() => {
          Alert.alert("WorseTinder", "User data has been saved successfully");
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ProfileHeader />

        <InfoForm userInfo={userInfoState} setuserInfoState = {setuserInfoState} type="fullName" />
        <InfoForm userInfo={userInfoState} setuserInfoState = {setuserInfoState} type="occupation" />
        <InfoForm userInfo={userInfoState} setuserInfoState = {setuserInfoState} type="age" />
        <InfoForm userInfo={userInfoState} setuserInfoState = {setuserInfoState} type="photoURL" />

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
    </SafeAreaView>
  );
};

const InfoForm = ({ userInfo, type, setuserInfoState }) => {

  const setUserInfoBasedOntype = (userinfo, text, type) => {
    if (type === "fullName") {
      setuserInfoState({
        ...userinfo,
        fullName: text,
      });
    } else if (type === "age") {
      setuserInfoState({
        ...userinfo,
        age: text,
      });
    } else if (type === "occupation") {
      setuserInfoState({
        ...userinfo,
        occupation: text,
      });
    } else if (type === "photoURL") {
      setuserInfoState({
        ...userinfo,
        photoURL: text,
      });
    }
  };

  const ToValueBasedOntype = (userInfo, type) => {
    let value;
    if (type === "fullName") {
      value = userInfo?.fullName;
    } else if (type === "occupation") {
      value = userInfo?.occupation;
    } else if (type === "age") {
      value = userInfo?.age?.toString();
    } else if (type === "photoURL") {
      value = userInfo?.photoURL;
    }

    //   else if (type === "tags"){
    //       value = userInfo?.tags;
    //   }
    return value;
  };
  return (
    <>
      <Text style={tw("text-xl text-gray-700 px-4 mt-6 font-bold")}>
        {type}
      </Text>
      <TextInput
        value={ToValueBasedOntype(userInfo, type)}
        onChangeText={(text) => setUserInfoBasedOntype(userInfo, text, type)}
        style={tw("text-xl bg-white py-3 px-4")}
      />
    </>
  );
};

export default ModalScreen;
