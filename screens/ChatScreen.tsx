import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  GiftedChat,
  MessageImageProps,
  MessageImage,
  ActionsProps,
  Actions,
  Bubble,
} from "react-native-gifted-chat";
import tw from "tailwind-rn";
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useUserInfo } from "../hooks/useUserInfo";

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
    <View style={tw("flex-1 px-2 py-6")}>
      {rooms.map((room, index) => (
        <ShowRoomdata room={room} key={index} navigation = {navigation}/>
      ))}
    </View>
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
    <TouchableOpacity
      style={tw("w-full bg-white rounded-xl py-3 px-2 flex-row items-center")}
      onPress={() => navigation.navigate("Match")}
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
  );
};

function Chatroom() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
        image:
          "https://scontent.fhan14-2.fna.fbcdn.net/v/t1.6435-9/129134489_1815340238642365_5220102743583472325_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=Nm9n-kUYGOUAX8q0c1k&_nc_ht=scontent.fhan14-2.fna&oh=00_AT_tgxc9YW2xiW2TY6-MqS4TUavRMh5sgEPwJipQHrE6Xg&oe=61EE8AE5",
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderActions={renderActions}
      user={{
        _id: 1,
      }}
    />
  );
}

function renderActions(props: Readonly<ActionsProps>) {
  function handlePickImage() {
    console.log("picking image");
  }
  return (
    <Actions
      {...props}
      options={{
        ["Send Image"]: handlePickImage,
      }}
      icon={() => (
        <Ionicons name="add-circle-outline" size={24} color="black" />
      )}
      onSend={(args) => console.log(args)}
    />
  );
}
