import { useCallback, useEffect, useState } from "react";
import { Actions, ActionsProps, GiftedChat } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useUserInfo } from "../hooks/useUserInfo";
import ChatHeader from "../components/ChatHeader";

export function Chatroom({ route, navigation }) {
  const { userInfo } = useUserInfo();
  const [messages, setMessages] = useState([]);
  const roomid = route.params.roomid;
  const OtherProfile = route.params.OtherProfile;
  const GetMessages = (roomid) => {
    const unsubscribe = firestore()
      .collection("match")
      .doc(roomid)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const newMessages = [];
        querySnapshot.forEach((documentSnapshot) => {
          const isSelf = documentSnapshot.data().user._id === userInfo.id;
          newMessages.push({
            ...documentSnapshot.data(),
            createdAt: documentSnapshot.data().createdAt?.toDate(),
            _id: documentSnapshot.id,
            user: {
              _id: isSelf ? 1 : documentSnapshot.data().user._id,
              name: isSelf
                ? userInfo.fullName
                : documentSnapshot.data().user.name,
              avatar: isSelf
                ? userInfo.photoURL
                : documentSnapshot.data().user.avatar,
            },
          });
        });
        console.log(newMessages);
        setMessages(newMessages);
      });
    return unsubscribe;
  };
  useEffect(() => {
    const unsubscribe = GetMessages(roomid);
    return unsubscribe;
  }, [roomid]);

  const onSend = useCallback((messages = []) => {
    const newMessages = messages.map((message) => ({
      ...message,
      user: {
        _id: 1,
        name: userInfo.fullName,
        avatar: userInfo.photoURL,
      },
    }));
    console.log(newMessages);
    newMessages.forEach((message) => {
      firestore()
        .collection("match")
        .doc(roomid)
        .collection("messages")
        .add({
          ...message,
          createdAt: firestore.FieldValue.serverTimestamp(),
          user: {
            _id: userInfo.id,
            avatar: userInfo.photoURL,
            name: userInfo.fullName,
          },
        });
    });
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <>
      <ChatHeader title={OtherProfile.fullName} callEnabled={true} navigation={navigation} whiteBackground={false}/> 
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderActions={renderActions}
        loadEarlier={true}
        user={{
          _id: 1,
        }}
      />
    </>
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
