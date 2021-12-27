import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import useAuth from "../hooks/useAuth";
import TinderCard from "react-tinder-card";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import firestore from "@react-native-firebase/firestore";

import tw from "tailwind-rn";
import { useUserInfo } from "../hooks/useUserInfo";

const DUMMY_DATA = [
  {
    fullName: "Elon Musk",
    occupation: "software engineer",
    photoURL:
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg",
    age: 45,
    id: 123,
    tags: ["Nooby", "Hailer", "Stripper", "CEO", "Nothing at all"],
  },
  {
    fullName: "alane Mulan",
    occupation: "software engineer",
    photoURL:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh5mmILTkRwAc266VWD17KfsQL9nk1RuYjEyN9WMzkmOaJxYhq8hIJn5edKcYoEk80VPI&usqp=CAU",
    age: 35,
    id: 456,
    tags: ["guitarist", "randomshit", "lover", "flirter"],
  },
  {
    fullName: "Jun Le",
    occupation: "software engineer boss",
    photoURL:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/60045428_1180040428834922_7963564425636478976_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=3MRSMXBrGNEAX8EBP19&_nc_ht=scontent.fhan2-4.fna&oh=3f23c56b7d613e36f1145e5051276e4d&oe=61CC248B",
    age: 20,
    id: 789,
    tags: ["handsome", "chaser", "solver", "football"],
  },
];

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
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
      .onSnapshot((snapshot) => {
        const filteredSnapshot = snapshot.docs.filter(
          (doc) => doc.id !== user.uid
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
    if(currentIndex < 0){
      Alert.alert("Worse Tinder", "No more profiles, go get a life")
    }
    else {
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

  const onCardLeftScreen = () => {
    console.log("left screen", currentIndexRef.current);
    setcurrentIndex(currentIndexRef.current - 1);
  };

  useEffect(() => {
    setcanSwipe(true);
  }, [currentIndex]);


  const Cards = tinderers.map((tinderer, index) => (
    <View style={tw("absolute w-full h-full")} key={index}>
      <TinderCard
        onSwipeRequirementFulfilled={(direction) =>
          onSwipeRequirementFulfilled(index, direction)
        }
        onSwipeRequirementUnfulfilled={() =>
          onSwipeRequirementUnfulfilled(index)
        }
        onCardLeftScreen={() => onCardLeftScreen()}
        flickOnSwipe={true}
        preventSwipe={["up", "down"]}
        swipeRequirementType="position"
        swipeThreshold={100}
        onSwipe={() => setcanSwipe(false)}
        ref={(el) => (cardref.current[index] = el)}

        // style={tw("flex-1 items-center content-center flex")}
      >
        <View
          style={[
            tw(
              "w-full self-center h-full items-center flex rounded-xl relative"
            ),
            { paddingBottom: 80 },
          ]}
        >
          <Image
            source={{ uri: tinderer.photoURL }}
            style={[
              tw("absolute top-0 h-full w-full rounded-xl"),
              { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
            ]}
          />

          {/* INFO */}
          <View
            style={[
              tw("absolute bg-transparent w-full px-6 py-2 z-10"),
              ,
              { bottom: 80 },
            ]}
          >
            {/* Main InFO */}
            <View style={tw("mb-2")}>
              <Text style={tw("text-3xl font-bold text-white")}>
                {tinderer.fullName}{" "}
                <Text style={tw("text-xl font-light")}>
                  {tinderer.age}
                </Text>
              </Text>
              <Text style={tw("text-white")}>{tinderer.occupation}</Text>
              <View style={tw("flex-row w-5/6 flex-wrap")}>
                {tinderer?.tags?.map((tag, index) => (
                  <Text
                    key={index}
                    style={[
                      tw("text-white px-3 py-2 rounded-2xl"),
                      styles.opacitybackground,
                    ]}
                  >
                    {tag}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Overlay label */}
          <View style={tw("relative items-center w-full")}>
            <Text
              ref={(el) => (matchref.current[index] = el)}
              style={[
                tw(
                  "absolute top-11 left-2 text-3xl font-bold opacity-0 px-3 py-3 text-center"
                ),
                styles.greenBorder,
                {
                  borderWidth: 5,
                  textAlignVertical: "center",
                  color: "rgb(40, 223, 174)",
                  transform: [{ rotateZ: "-45deg" }],
                },
              ]}
            >
              MATCH
            </Text>
            <Text
              ref={(el) => (noperef.current[index] = el)}
              style={[
                tw(
                  "absolute text-3xl top-11 right-3 font-bold opacity-0 px-3 py-3 text-center"
                ),
                styles.roseBorder,
                {
                  borderWidth: 5,
                  textAlignVertical: "center",
                  color: "rgba(232, 40, 95, 1)",
                  transform: [{ rotateZ: "45deg" }],
                },
              ]}
            >
              NOPE
            </Text>
          </View>

          {/* Card dark background at the bottom*/}
          <LinearGradient
            style={{
              height: 80,
              width: "100%",
              position: "absolute",
              bottom: 0,
            }}
            colors={["rgba(0,0,0,1)", "rgba(1,5,13,1)"]}
          ></LinearGradient>
          <LinearGradient
            style={{
              height: 80,
              width: "100%",
              position: "absolute",
              bottom: 80,
            }}
            colors={["rgba(0,0,0,0)", "rgba(1,5,13,1)"]}
          ></LinearGradient>
        </View>
      </TinderCard>
    </View>
  ));


  return (
    <View style={tw("flex-1 relative")}>
      {/* HEADER */}
      <View
        style={tw("items-center flex-row justify-between px-5 z-20 bg-white")}
      >
        <TouchableOpacity onPress={logout}>
          <Image
            style={[tw("h-10 w-10 rounded-full")]}
            source={{ uri: user?.photoURL }}
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
        <View style={tw(" w-full h-full justify-center items-center")} >
          <Image style = {tw("h-20 w-20 mb-5")} source = {{uri : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEayg_1RdFOpaXVnJE57TD3jkEqQ2KFCZ5ZQ&usqp=CAU"}}/>
          <Text style = {tw("text-2xl font-bold")}>No more profiles</Text>
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
            onPress={() => SwipeUndo()}
            style={[
              tw("items-center justify-center rounded-full w-12 h-12"),
              styles.yellowBorder,
            ]}
          >
            <FontAwesome5 name="undo" size={20} color="rgb(252, 204, 82)" />
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

const styles = StyleSheet.create({
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
