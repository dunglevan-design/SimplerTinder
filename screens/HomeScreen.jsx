import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import TinderCard from "react-tinder-card";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

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
  },
  {
    firstName: "alnane",
    lastName: "molan",
    occupation: "software engineer",
    photoURL:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh5mmILTkRwAc266VWD17KfsQL9nk1RuYjEyN9WMzkmOaJxYhq8hIJn5edKcYoEk80VPI&usqp=CAU",
    age: 35,
    id: 456,
  },
  {
    firstName: "Jun",
    lastName: "Le",
    occupation: "software engineer boss",
    photoURL:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/60045428_1180040428834922_7963564425636478976_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=3MRSMXBrGNEAX8EBP19&_nc_ht=scontent.fhan2-4.fna&oh=3f23c56b7d613e36f1145e5051276e4d&oe=61CC248B",
    age: 20,
    id: 789,
  },
];

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const matchref = useRef(null);
  const noperef = useRef(null);
  const tinderers = DUMMY_DATA;
  const onSwipeRequirementFulfilled = (direction) => {
    console.log("You swiped: " + direction);
    matchref.current.setNativeProps({
      style: {
        display: "flex",
      },
    });
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
      <View style={tw("relative mt-4 w-full h-3/4")}>
        {/* Mapping for card */}
        {tinderers.map((tinderer, index) => (
          <View style={tw("absolute w-full h-full")} key={index}>
            <TinderCard
              onSwipeRequirementFulfilled={onSwipeRequirementFulfilled}
              onCardLeftScreen={() => onCardLeftScreen("fooBar")}
              preventSwipe={["right", "left"]}
              style={tw("flex-1 items-center content-center flex")}
            >
              <View
                style={tw(
                  "w-10/12 self-center h-full items-center flex bg-red-300 rounded-xl"
                )}
              >
                <Image
                  source={{ uri: tinderer.photoURL }}
                  style={tw("absolute top-0 h-5/6 w-full rounded-xl")}
                />
                <View
                  style={[
                    tw(
                      "absolute bottom-0 bg-white w-full h-24 flex-row justify-between items-center px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {tinderer.firstName} {tinderer.lastName}
                    </Text>
                    <Text>{tinderer.occupation}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{tinderer.age}</Text>
                </View>
                {/* Overlay label */}
              </View>
            </TinderCard>
          </View>
        ))}

        <View style={tw("")}>
          <Text ref={matchref} style={tw("text-xl font-bold text-white ")}>
            MATCH
          </Text>
          <Text ref={noperef} style={tw("text-xl font-bold text-white ")}>
            NOPE
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
