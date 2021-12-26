import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-rn";
import ProfileHeader from "../components/ProfileHeader";
import { useUserInfo } from "../hooks/useUserInfo";
import firestore from '@react-native-firebase/firestore';

const Dictionary = {
  fullName: "fullName",
};
const ModalScreen = ({ navigation }) => {
  const { userInfo } = useUserInfo();
  useEffect(() => {
    navigation.setOptions({
      animation: "slide_from_right",
      animationTypeForReplace: "push",
    });
  }, []);

  const SaveUserInfo = () => {
    firestore()
    .collection('users').doc(userInfo.id.toString())
    .set({
      name: userInfo.fullName,
      age: userInfo.age,
      occupation: userInfo.occupation,
    })
    .then(() => {
      console.log('User added!');
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ProfileHeader />

        <InfoForm
          userInfo={userInfo}
          type="fullName"
        />
        <InfoForm
          userInfo={userInfo}
          type="occupation"
        />
        <InfoForm userInfo={userInfo} type="age" />
        <InfoForm userInfo={userInfo} type="photoURL" />

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

const InfoForm = ({ userInfo,  type }) => {
  const setUserInfoBasedOntype = (userinfo, text, type) => {
    if (type === "fullName") {
    } else if (type === "age") {
    }
    else if (type === "occupation"){
    }
    else if (type === "photoURL"){
        // setUserInfo({
        //     ...userinfo,
        //     photoURL: text,
        // })
    }
  };

  const ToValueBasedOntype = (userInfo, type) => {
    let value;
    if (type === "fullName") {
      value = userInfo?.fullName;
    } else if (type === "occupation") {
      value = userInfo?.occupation;
    } else if (type === "age") {
      value = userInfo?.age.toString();
    }
    else if (type === "photoURL"){
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
