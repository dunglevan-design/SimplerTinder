import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import useAuth from "../hooks/useAuth";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import tw from "tailwind-rn";
import { useUserInfo } from "../hooks/useUserInfo";
import TinderCard from "../components/TinderCard";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { userInfo } = useUserInfo();
  const matchref = useRef([]);
  const noperef = useRef([]);
  const cardref = useRef([]);
  const UndoButton = useRef(null);
  const [currentIndex, setcurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;
  const [tinderers, setTinderers] = useState([]);

  const [canSwipe, setcanSwipe] = useState(true);

  // const [canUndo]

  const NumberofRender = useRef(0);

  useEffect(() => {
    console.log("render time: ", NumberofRender.current, ": ", currentIndex);
    NumberofRender.current += 1;
  });

  const onSwipeRequirementFulfilled = (index, direction) => {
    console.log("You swiped: " + direction);
    console.log("You swiped: " + index);
    setcanSwipe(false);
    if (direction === "right") {
      noperef.current[index].setNativeProps({
        style: {
          opacity: 0,
        },
      });
      matchref.current[index].setNativeProps({
        style: {
          opacity: 1,
        },
      });
    }

    if (direction === "left") {
      noperef.current[index].setNativeProps({
        style: {
          opacity: 1,
        },
      });
      matchref.current[index].setNativeProps({
        style: {
          opacity: 0,
        },
      });
    }
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .onSnapshot(async (snapshot) => {
        const swipedProfiles = await firestore()
          .collection("users")
          .doc(user.uid)
          .collection("swipedProfiles")
          .get();
        const swipedProfilesId = swipedProfiles.docs.map(
          (profile) => profile.id
        );
        const passesProfiles = await firestore()
          .collection("users")
          .doc(user.uid)
          .collection("passesProfiles")
          .get();
        const passesProfilesId = passesProfiles.docs.map(
          (profile) => profile.id
        );

        const filteredSnapshot = snapshot.docs.filter(
          (doc) =>
            doc.id !== user.uid &&
            !swipedProfilesId.includes(doc.id) &&
            !passesProfilesId.includes(doc.id)
        );
        setcurrentIndex(filteredSnapshot.length - 1);
        setTinderers(
          filteredSnapshot.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

    return subscriber;
  }, []);

  useEffect(() => {
    navigation.setOptions({
      animation: "slide_from_right",
    });
  }, []);

  const onSwipeRequirementUnfulfilled = (index) => {
    setcanSwipe(true);
    console.log("unfullfill ", index);
    noperef.current[index].setNativeProps({
      style: {
        opacity: 0,
      },
    });
    matchref.current[index].setNativeProps({
      style: {
        opacity: 0,
      },
    });
  };

  const Swipe = (direction) => {
    console.log("swiping ", direction, currentIndex);
    if (currentIndex < 0) {
      Alert.alert("Worse Tinder", "No more profiles, go get a life");
    } else {
      cardref.current[currentIndex].swipe(direction);
    }
  };

  const canUndo = () => {
    return currentIndex < tinderers.length - 1;
  };

  const SwipeUndo = async () => {
    console.log("undoing swipe", currentIndex);
    if (canUndo()) {
      setcurrentIndex(currentIndex + 1);
      await cardref.current[currentIndex + 1].restoreCard();
    } else {
      console.log("cant undo");
    }
  };

  useEffect(() => {
    matchref.current = matchref.current.slice(0, tinderers.length);
    noperef.current = noperef.current.slice(0, tinderers.length);
  }, [tinderers]);

  const onCardLeftScreen = async (direction) => {
    console.log("left screen", currentIndexRef.current);
    const currentCard = tinderers[currentIndexRef.current];
    setcurrentIndex(currentIndexRef.current - 1);
    // Add swipe profiles to firebase
    if (direction === "left") {
      //NOPE
      try {
        const result = await firestore()
          .collection("users")
          .doc(user.uid)
          .collection("swipedProfiles")
          .doc(currentCard.id)
          .set(currentCard);
        console.log(result);
      } catch (error) {
        Alert.alert("worseTinder", error);
      }
    } else if (direction === "right") {
      //PASSES
      try {
        firestore()
          .collection("users")
          .doc(user.uid)
          .collection("passesProfiles")
          .doc(currentCard.id)
          .set(currentCard);
      } catch (error) {
        Alert.alert("worseTinder", error);
      }

      //checking if the person passes you already
      //YES: Create a match, navigate match modal

      if (
        (
          await firestore()
            .collection("users")
            .doc(currentCard.id)
            .collection("passesProfiles")
            .doc(user.uid)
            .get()
        ).exists
      ) {
        //Create a match
        try {
          firestore()
            .collection("match")
            .add({
              matchProfile1: userInfo,
              matchProfile2: currentCard,
              matchIDs: [userInfo.id, currentCard.id],
            });
        } catch (error) {
          Alert.alert(error);
        }
        navigation.navigate("Match", {
          userInfo,
          currentCard,
        });
      }
    }
  };

  useEffect(() => {
    setcanSwipe(true);
  }, [currentIndex]);

  const Cards = tinderers.map((tinderer, index) => (
    <TinderCard
      key={index}
      tinderer={tinderer}
      index={index}
      onSwipeRequirementFulfilled={onSwipeRequirementFulfilled}
      onSwipeRequirementUnfulfilled={onSwipeRequirementUnfulfilled}
      onCardLeftScreen={onCardLeftScreen}
      setcanSwipe={setcanSwipe}
      cardref={cardref}
      matchref={matchref}
      noperef={noperef}
    />
  ));

  return (
    <View style={tw("flex-1 relative bg-black")}>
      {/* HEADER */}
      <View
        style={tw("items-center flex-row justify-between px-5 z-20 bg-white")}
      >
        <TouchableOpacity onPress={logout}>
          <Image
            style={[tw("h-10 w-10 rounded-full")]}
            source={{ uri: userInfo?.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            style={tw("h-14 w-14")}
            source={require("../images/applogo.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={40} color="#ff5868" />
        </TouchableOpacity>
      </View>
      {/* DECK */}

      <View
        style={tw("relative mt-1 w-full flex-1")}
        pointerEvents={canSwipe ? "auto" : "none"}
      >
        {/* Mapping for card */}
        <View style={tw(" w-full h-full justify-center items-center")}>
          <Image
            style={tw("h-40 w-40 mb-5")}
            source={{
              uri: "https://images.pond5.com/animated-sad-emoji-isolated-black-footage-149978354_iconl.jpeg",
            }}
          />
          <Text style={tw("text-2xl font-bold text-white")}>No more profiles</Text>
        </View>
        {Cards}
        {/* Controls section has transparent background*/}

        <View
          style={tw(
            "absolute bottom-2 z-10 w-full flex flex-row justify-evenly items-center"
          )}
        >
          <TouchableOpacity
            onPress={() => Swipe("left")}
            style={[
              tw("items-center justify-center rounded-full w-16 h-16 border-2"),
              styles.roseBorder,
            ]}
          >
            <Entypo name="cross" size={48} color="rgba(232, 40, 95, 1)" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (currentIndex >= 0)
                navigation.navigate("TindererProfile", {
                  tinderer: tinderers[currentIndex],
                });
            }}
            style={[
              tw(
                "justify-center items-center rounded-full border-white bg-white border-2 p-1"
              ),
              { zIndex: 100, top: 0 },
            ]}
          >
            <AntDesign name="info" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => SwipeUndo()}
            style={[
              tw("items-center justify-center rounded-full w-12 h-12"),
              styles.yellowBorder,
            ]}
          >
            <FontAwesome5 name="undo" size={20} color="rgb(252, 204, 82)" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("pressed in")}
            style={[
              tw("justify-center items-center rounded-full border-2 p-1"),
              { zIndex: 100, top: 0, borderColor: "#ba53f4" },
            ]}
          >
            <Ionicons name="flash" size={24} color="#ba53f4" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Swipe("right")}
            style={[
              tw("items-center justify-center rounded-full w-16 h-16"),
              styles.greenBorder,
            ]}
          >
            <AntDesign name="heart" size={28} color="rgb(40, 223, 174)" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  opacitybackground: {
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  roseBorder: {
    borderColor: "rgba(232, 40, 95, 1)",
    borderWidth: 2,
  },

  greenBorder: {
    borderColor: "rgb(40, 223, 174)",
    borderWidth: 2,
  },

  yellowBorder: {
    borderColor: "rgb(252, 204, 82)",
    borderWidth: 2,
  },
});
