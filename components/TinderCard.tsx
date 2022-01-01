import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, StyleSheet } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { LinearGradient } from "expo-linear-gradient";
import tw from "tailwind-rn";
import Tindercard from "react-tinder-card";

const TinderCard = ({
  tinderer,
  index,
  onSwipeRequirementFulfilled,
  onSwipeRequirementUnfulfilled,
  onCardLeftScreen,
  setcanSwipe,
  cardref,
  matchref,
  noperef,
}) => {
  return (
    <View style={tw("absolute w-full h-full")} key={index}>
      <Tindercard
        onSwipeRequirementFulfilled={(direction) =>
          onSwipeRequirementFulfilled(index, direction)
        }
        onSwipeRequirementUnfulfilled={() =>
          onSwipeRequirementUnfulfilled(index)
        }
        onCardLeftScreen={(direction) => onCardLeftScreen(direction)}
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
          <SharedElement
            id={tinderer.id}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              source={{ uri: tinderer.photoURL }}
              style={[
                tw("absolute top-0 left-0 h-full w-full rounded-xl"),
                {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  resizeMode: "cover",
                },
              ]}
            />
          </SharedElement>

          {/* INFO */}
          <View
            style={[
              tw("absolute bg-transparent w-full px-6 py-2 z-10"),
              ,
              { bottom: 80 },
            ]}
          >
            {/* Main InFO */}
            <View style={[tw("mb-2")]}>
              <View style={[tw("justify-center")]}>
                <SharedElement id={`info${tinderer.id}`}>
                  <Text style={tw("text-3xl font-bold text-white")}>
                    {tinderer.fullName}{" "}
                    <Text style={tw("text-xl font-light")}>{tinderer.age}</Text>
                  </Text>
                </SharedElement>
              </View>
              <SharedElement id={`occupation${tinderer.id}`}>
                <Text style={tw("text-white")}>{tinderer.occupation}</Text>
              </SharedElement>

              <SharedElement id={`tags${tinderer.id}`}>
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
              </SharedElement>
            </View>
          </View>

          {/* Overlay label */}
          <View style={tw("absolute items-center w-full")}>
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
      </Tindercard>
    </View>
  );
};

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
export default TinderCard;
