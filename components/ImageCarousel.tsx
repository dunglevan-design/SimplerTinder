import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import { Entypo } from '@expo/vector-icons';

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
const IMAGE_SIZE = 80;
const SPACING = 10;

const ImageCarousel = ({ images, activeIndex, setActiveIndex, setOpenImageModal }) => {
  console.log(images);

  
  const topRef = useRef();
  const thumbRef = useRef();
  const scrollToActiveIndex = (index) => {
      setActiveIndex(index);
      //@ts-ignore
      topRef?.current?.scrollToOffset({
          offset: index * ScreenWidth,
          animated: true
      })
      if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE/2 > ScreenWidth/2){
          //@ts-ignore
          thumbRef?.current?.scrollToOffset({
              offset: index * (IMAGE_SIZE + SPACING) - ScreenWidth /2 + IMAGE_SIZE /2,
              animated: true
          })
      }

      else {
          //@ts-ignore
        thumbRef?.current?.scrollToOffset({
            offset: 0,
            animated: true
        })
      }
  };

  useEffect(() => {
      scrollToActiveIndex(activeIndex);
  }, [])
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#000", position: "relative" }}>
      <TouchableOpacity style = {{position: "absolute", zIndex: 11, right: 10, top: 10}} onPress={() => setOpenImageModal(false)}>
          <Entypo name="cross" size={48} color="rgba(232, 40, 95, 1)" style = {{}}/>
      </TouchableOpacity>
        <FlatList
          ref={topRef}
          data={images}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(ev) => {
            scrollToActiveIndex(
              Math.floor(ev.nativeEvent.contentOffset.x / ScreenWidth)
            );
          }}
          renderItem={(item) => (
            <View style={{ width: ScreenWidth, height: ScreenHeight }}>
              <Image
                resizeMode="contain"
                style={[StyleSheet.absoluteFillObject]}
                source={{ uri: item.item }}
              />
            </View>
          )}
        />
      </View>
      <View style={{ position: "absolute", bottom: 80 }}>
        <FlatList
          ref={thumbRef}
          data={images}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item,index}) => (
            <TouchableOpacity
              onPress={() => scrollToActiveIndex(index)}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                marginLeft: index !== 0 ? SPACING : 0,
              }}
            >
              <Image
                style={[StyleSheet.absoluteFillObject, { borderRadius: 12, borderWidth: 2, borderColor : activeIndex === index ? "rgba(232, 40, 95, 1)": "transparent" }]}
                source={{ uri: item }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
};

export default ImageCarousel;
