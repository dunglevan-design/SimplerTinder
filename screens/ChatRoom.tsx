import { useCallback, useEffect, useState } from "react";
import { Actions, ActionsProps, GiftedChat } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useUserInfo } from "../hooks/useUserInfo";
import ChatHeader from "../components/ChatHeader";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { uid } from "uid";
import { Image, Text, View } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";

export function Chatroom({ route, navigation }) {
  const { userInfo } = useUserInfo();
  const [messages, setMessages] = useState([]);
  const roomid = route.params.roomid;
  const OtherProfile = route.params.OtherProfile;
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");

  const GetMessages = (roomid) => {
    const unsubscribe = firestore()
      .collection("match")
      .doc(roomid)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
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

        console.log("intiial room message : >>>>", newMessages);
        setMessages(newMessages);
      });
    return unsubscribe;
  };
  useEffect(() => {
    GetMessages(roomid);
  }, [roomid]);

  useEffect(() => {
    console.log("you just set image state to: ", image);
  }, [image]);

  useEffect(() => {
    console.log("you just set video state to: ", video);
  }, [video]);

  const onSend = useCallback(
    (messages = []) => {
      console.log("image: ", image);
      const newMessages = messages.map((message) => ({
        ...message,
        image: image,
        video: video,
        user: {
          _id: 1,
          name: userInfo.fullName,
          avatar: userInfo.photoURL,
        },
      }));

      console.log("new messages: >>>>", newMessages);
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
      setImage("");
      setVideo("");
    },
    [image, video]
  );

  async function handlePickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      //upload image to bucket
      const reference = storage().ref(`${roomid}/${uid()}`);
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

        const type = (await reference.getMetadata()).contentType;
        if (type === "image/jpeg") {
          console.log("you sent an image");
          setImage(url);
        } else {
          console.log("you sent a video");
          setVideo(url);
        }
      });
    }
  }

  function renderActions(props: Readonly<ActionsProps>) {
    return (
      <Actions
        {...props}
        options={{
          ["Send Image/Video"]: handlePickImage,
        }}
        icon={() => (
          <Ionicons name="add-circle-outline" size={24} color="black" />
        )}
        // onSend={(args) => console.log(args, "dsdfsdflgsdfgjs;dfgjsd;flg")}
      />
    );
  }

  const renderMessageVideo = (messages) => {
    console.log("message >>>>>>>>>>>", messages);
    return (
      <Video
        style={{
          width: 300,
          height: 300,
          borderRadius: 5,
          backgroundColor: "#000",
        }}
        source={{
          uri: messages?.currentMessage.video,
        }}
        useNativeControls
        resizeMode="cover"
        isLooping
        shouldPlay={true}
      />
    );
  };

  const renderFooter = () => {
    return (
      <>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: 70, height: 80, marginLeft: "20%" }}
          ></Image>
        ) : (
          <></>
        )}
        {video ? (
          <Video
            style={{
              width: 100,
              height: 100,
              borderRadius: 5,
              backgroundColor: "#000",
            }}
            source={{
              uri: video,
            }}
            useNativeControls
            resizeMode="cover"
            isLooping
            shouldPlay={true}
          />
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <>
      <ChatHeader
        title={OtherProfile.fullName}
        callEnabled={true}
        navigation={navigation}
        whiteBackground={false}
      />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderActions={renderActions}
        loadEarlier={true}
        renderFooter={renderFooter}
        renderMessageVideo={(messages) => renderMessageVideo(messages)}
        user={{
          _id: 1,
        }}
      />
    </>
  );
}
