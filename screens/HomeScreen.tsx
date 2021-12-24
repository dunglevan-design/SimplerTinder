import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import TinderCard from "react-tinder-card";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons'; 

import tw from "tailwind-rn";

const DUMMY_DATA = [
  {
    firstName: "elon",
    lastName: "musk",
    occupation: "software engineer",
    photoURL:
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg",
    age: 45,
    id: 123,
    tags: ["Nooby", "Hailer", "Stripper", "CEO", "Nothing at all"],
  },
  {
    firstName: "alnane",
    lastName: "molan",
    occupation: "software engineer",
    photoURL:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh5mmILTkRwAc266VWD17KfsQL9nk1RuYjEyN9WMzkmOaJxYhq8hIJn5edKcYoEk80VPI&usqp=CAU",
    age: 35,
    id: 456,
    tags: ["guitarist", "randomshit", "lover", "flirter"],
  },
  {
    firstName: "Jun",
    lastName: "Le",
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
  const matchref = useRef(null);
  const noperef = useRef(null);
  const tinderers = DUMMY_DATA;
  const onSwipeRequirementFulfilled = (direction) => {
    console.log("You swiped: " + direction);

    if (direction === "right") {
      noperef.current.setNativeProps({
        style: {
          display: "none",
        },
      });
      matchref.current.setNativeProps({
        style: {
          display: "flex",
        },
      });
    }

    if (direction === "left") {
      noperef.current.setNativeProps({
        style: {
          display: "flex",
        },
      });
      matchref.current.setNativeProps({
        style: {
          display: "none",
        },
      });
    }
  };

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + " left the screen");
  };
  return (
    <View style={tw("flex-1 relative")}>
      {/* HEADER */}
      <View style={tw("items-center flex-row justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user?.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
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
      <View style={tw("relative mt-1 w-full flex-1")}>
        {/* Mapping for card */}
        {tinderers.map((tinderer, index) => (
          <View style={tw("absolute w-full h-full px-1")} key={index}>
            <TinderCard
              onSwipeRequirementFulfilled={onSwipeRequirementFulfilled}
              onCardLeftScreen={() => onCardLeftScreen("fooBar")}
              preventSwipe={["up", "down"]}
              // style={tw("flex-1 items-center content-center flex")}
            >
              <View
                style={tw(
                  "w-full self-center h-full items-center flex bg-red-300 rounded-xl"
                )}
              >
                <Image
                  source={{ uri: tinderer.photoURL }}
                  style={tw("absolute top-0 h-full w-full rounded-xl")}
                />

                {/* INFO */}
                <View
                  style={[
                    tw(
                      "absolute bottom-0 bg-transparent w-full px-6 py-2 rounded-b-xl border-black border-2"
                    ),
                  ]}
                >
                  {/* Main InFO */}
                  <View style = {tw("mb-2")}>
                    <Text style={tw("text-3xl font-bold text-white")}>
                      {tinderer.firstName} {tinderer.lastName}{" "}
                      <Text style={tw("text-xl font-light")}>
                        {tinderer.age}
                      </Text>
                    </Text>
                    <Text style={tw("text-white")}>{tinderer.occupation}</Text>
                    <View style={tw("flex-row w-5/6 flex-wrap")}>
                      {tinderer.tags.map((tag, index) => (
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

                  {/* Controls */}
                  <View style={tw("w-full flex flex-row justify-evenly items-center")}>
                    <TouchableOpacity
                      style={[tw(
                        "items-center justify-center rounded-full w-16 h-16 border-2"
                      ), styles.roseBorder]}
                    >
                      <Entypo name="cross" size={48} color="rgba(232, 40, 95, 1)" />
                    </TouchableOpacity>

                    
                    <TouchableOpacity
                      // onPress={() => swipeRef.current.swipeRight()}
                      style={[tw(
                        "items-center justify-center rounded-full w-12 h-12"
                      ), styles.yellowBorder]}
                    >
                      <FontAwesome5 name="undo" size={20} color="rgb(252, 204, 82)" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      // onPress={() => swipeRef.current.swipeRight()}
                      style={[tw(
                        "items-center justify-center rounded-full w-16 h-16"
                      ), styles.greenBorder]}
                    >
                      <AntDesign name="heart" size={28} color="rgb(40, 223, 174)" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Overlay label */}
                <View style={tw("")}>
                  <Text
                    ref={matchref}
                    style={tw("text-xl font-bold text-white hidden")}
                  >
                    MATCH
                  </Text>
                  <Text
                    ref={noperef}
                    style={tw("text-xl font-bold text-white hidden")}
                  >
                    NOPE
                  </Text>
                </View>
              </View>
            </TinderCard>
          </View>
        ))}
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
  }
});
