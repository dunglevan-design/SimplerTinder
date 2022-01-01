import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "tailwind-rn";
import firestore from "@react-native-firebase/firestore";
import { useUserInfo } from "../hooks/useUserInfo";
import ChatHeader from "../components/ChatHeader";

const ChatScreen = ({ navigation }) => {
  const { userInfo } = useUserInfo();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("match")
      .where("matchIDs", "array-contains", userInfo.id)
      .onSnapshot((querysnapshot) => {
        const newrooms = [];
        querysnapshot.forEach((documentsnapshot) => {
          newrooms.push({
            id: documentsnapshot.id,
            ...documentsnapshot.data(),
          });
        });
        setRooms(newrooms);
      });
    return unsubscribe;
  }, []);

  return (
    <>
      <ChatHeader  navigation= {navigation} title="Chat" callEnabled={false} whiteBackground={false} />

      <View style={tw("flex-1 px-2")}>
        {rooms.map((room, index) => (
          <ShowRoomdata room={room} key={index} navigation={navigation} />
        ))}
      </View>
    </>
  );
};

export default ChatScreen;

const ShowRoomdata = ({ room, navigation }) => {
  const { userInfo } = useUserInfo();
  const [roomMessage, setroomMessage] = useState();
  const OtherProfile =
    room?.matchProfile1?.id === userInfo.id
      ? room.matchProfile2
      : room.matchProfile1;

  useEffect(() => {
    // const unsubscribe = firestore()
    //   .collection("match")
    //   .doc(room.id)
    //   .collection("messages")
    //   .onSnapshot((querysnapshot) => {
    //   });
  }, [room]);

  return (
    <>
      <TouchableOpacity
        style={tw("w-full bg-white rounded-xl py-3 px-2 flex-row items-center")}
        onPress={() =>
          navigation.navigate("ChatRoom", {
            roomid : room.id,
            OtherProfile,
          })
        }
      >
        <Image
          style={[tw("rounded-full"), { width: 60, height: 60 }]}
          source={{ uri: OtherProfile?.photoURL }}
        />
        <View>
          <Text style={tw("ml-3 font-bold text-xl")}>
            {OtherProfile?.fullName}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};
