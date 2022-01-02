import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import tw from "tailwind-rn";
import storage from "@react-native-firebase/storage";
import ImageCarousel from "../components/ImageCarousel";
import { SharedElement } from "react-navigation-shared-element";
import LottieView from "lottie-react-native";

let ScreenWidth = Dimensions.get("window").width;
const TindererProfile = ({ route, navigation }) => {
  console.log(route);
  const tinderer = route.params.tinderer;
  const loader = useRef();
  const [images, setImages] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const reference = storage().ref(`${tinderer.id}`);
    let isSubscribed = true;
    async function listFilesAndDirectories(reference, pageToken) {
      return reference.list({ pageToken }).then(async (result) => {
        // Loop over each item
        // result.items.forEach(async ref => {
        //   console.log(ref.fullPath);
        //   const url = await storage().ref(ref.fullPath).getDownloadURL();
        // });

        const urls = await Promise.all(
          result.items.map(async (ref) => {
            const url = await storage().ref(ref.fullPath).getDownloadURL();
            return url;
          })
        );

        if (isSubscribed) {
          setImages(urls);
          console.log(urls);
        }

        if (result.nextPageToken) {
          return listFilesAndDirectories(reference, result.nextPageToken);
        }

        return Promise.resolve();
      });
    }
    //@ts-ignore
    listFilesAndDirectories(reference).then(() => {
      console.log("Finished listing");
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const showImageModal = (index) => {
    setActiveIndex(index);
    setOpenImageModal(true);
  };

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      delay: 500,
      useNativeDriver: true,
    }).start();

    //@ts-ignore
    loader?.current?.play();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {openImageModal ? (
        <ImageCarousel
          images={images}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setOpenImageModal={setOpenImageModal}
        />
      ) : (
        <ScrollView style={{ backgroundColor: "#000" }}>
          {/* HEADER */}
          <View
            style={{
              width: "100%",
              height: 0.75 * ScreenWidth,
              marginBottom: 20,
            }}
          >
            <SharedElement id={tinderer.id}>
              <Image
                source={{ uri: tinderer.photoURL }}
                style={{ width: "100%", height: "100%" }}
              />
            </SharedElement>
            <Animated.View
              style={[
                {
                  opacity,
                  padding: 4,
                  backgroundColor: "#fe5444",
                  bottom: -30,
                  right: 40,
                },
                tw("w-16 h-16 absolute rounded-full"),
              ]}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[tw("items-center justify-center w-full h-full")]}
              >
                <Entypo name="arrow-down" size={32} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* <Animated.View style={{ opacity ,marginTop: 10, padding: 20 }}>
            <Text style={tw("text-2xl font-bold")}>
              {tinderer.fullName}, {tinderer.age}
            </Text>
            <Text>{tinderer.occupation}</Text>
          </Animated.View> */}

          <View style={tw("w-full px-6 py-2")}>
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
                        { backgroundColor: "rgba(0,0,0,0.3)" },
                      ]}
                    >
                      {tag}
                    </Text>
                  ))}
                </View>
              </SharedElement>
            </View>
          </View>

          {!(images.length > 0) && (
            <View style = {{display: "flex" , alignItems: "center"}}>
              <LottieView
                ref={loader}
                style={{
                  width: ScreenWidth * 0.8,
                  backgroundColor: "#000",
                }}
                source={require("../images/loader.json")}
                // OR find more Lottie files @ https://lottiefiles.com/featured
                // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
              />
              <Text style = {[{color: "#00ff90"}, tw("text-2xl font-bold")]}>Fetching ...</Text>
            </View>
          )}

          <View
            style={{
              width: "100%",
              flexWrap: "wrap",
              flexDirection: "row",
              marginBottom: 100,
            }}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                onPress={() => showImageModal(index)}
                style={{ width: ScreenWidth / 3, height: ScreenWidth / 3 }}
                key={index}
              >
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: {},
});

export default TindererProfile;
