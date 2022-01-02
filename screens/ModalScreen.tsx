import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-rn";
import ProfileHeader from "../components/ProfileHeader";
import { useUserInfo } from "../hooks/useUserInfo";
import firestore from "@react-native-firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { uid } from "uid";
import ImageCarousel from "../components/ImageCarousel";
import { TagSelect } from "react-native-tag-select";
import SettingsModal from "../components/SettingsModal";
import { InfoForm } from "../components/InfoForm";
import LottieView from "lottie-react-native";
import { Dimensions } from "react-native";

const data = [
  { id: 1, label: "Money" },
  { id: 2, label: "Travel" },
  { id: 3, label: "LGBTQ+" },
  { id: 4, label: "INFJ" },
  { id: 5, label: "Bitcoin" },
  { id: 6, label: "Fishing" },
  { id: 7, label: "Football" },
  { id: 8, label: "Outdoor" },
  { id: 9, label: "Indoor" },
  { id: 10, label: "Wine" },
  { id: 11, label: "Basketball" },
  { id: 12, label: "Climbing" },
  { id: 13, label: "Comedy" },
  { id: 14, label: "Cars" },
  { id: 15, label: "Intimate Chat" },
  { id: 16, label: "Swimming" },
  { id: 17, label: "Dancing" },
  { id: 18, label: "Art" },
  { id: 19, label: "Karaoke" },
];

let ScreenWidth = Dimensions.get("window").width;

const ModalScreen = ({ navigation }) => {
  const { userInfo } = useUserInfo();

  const [userInfoState, setuserInfoState] = useState({
    fullName: "",
    age: 0,
    occupation: "",
  });

  const flatList = useRef(null);
  const [images, setImages] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const loader = useRef();
  const tag = useRef();

  useEffect(() => {
    setuserInfoState({
      ...userInfo,
    });
    //@ts-ignore
    loader?.current?.play();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      animation: "slide_from_right",
      animationTypeForReplace: "push",
    });
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      //upload image to bucket
      const reference = storage().ref(`${userInfo.id}/${uid()}`);
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
        setImages((previousImages) => [...previousImages, url]);
      });
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const reference = storage().ref(`${userInfo.id}`);

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

  const SaveUserInfo = () => {
    console.log(">>>>>>>>>>> :", userInfoState);
    firestore()
      .collection("users")
      .doc(userInfo.id.toString())
      .set({
        ...userInfo,
        fullName: userInfoState.fullName,
        age: userInfoState.age,
        occupation: userInfoState.occupation,
        //@ts-ignore
        tags: (tag?.current?.itemsSelected).map((tag) => tag.label),
      })
      .then(() => {
        Alert.alert("WorseTinder", "User data has been saved successfully");
      });
  };

  const showImageModal = (index) => {
    setActiveIndex(index);
    setOpenImageModal(true);
  };

  const scrollToEditInfo = () => {
    flatList.current.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SettingsModal
        settingsModalVisible={settingsModalVisible}
        setSettingsModalVisible={setSettingsModalVisible}
      />
      {openImageModal ? (
        <ImageCarousel
          images={images}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setOpenImageModal={setOpenImageModal}
        />
      ) : (
        <FlatList
          ref={flatList}
          ListHeaderComponent={
            <>
              <ProfileHeader
                pickImage={pickImage}
                navigation={navigation}
                scrollToEditInfo={scrollToEditInfo}
                setSettingsModalVisible={setSettingsModalVisible}
              />
              {!(images.length > 0) && (
                <View style={{ alignItems: "center" }}>
                  <LottieView
                    ref={loader}
                    style={{
                      width: ScreenWidth * 0.8,
                      backgroundColor: "#f2f2f2",
                    }}
                    source={require("../images/loader2.json")}
                    // OR find more Lottie files @ https://lottiefiles.com/featured
                    // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                  />
                  <Text
                    style={[{ color: "#00ff90" }, tw("text-2xl font-bold")]}
                  >
                    Fetching ...
                  </Text>
                </View>
              )}
            </>
          }
          ListFooterComponent={
            <>
              <InfoForm
                userInfo={userInfoState}
                setuserInfoState={setuserInfoState}
                type="fullName"
              />
              <InfoForm
                userInfo={userInfoState}
                setuserInfoState={setuserInfoState}
                type="occupation"
              />
              <InfoForm
                userInfo={userInfoState}
                setuserInfoState={setuserInfoState}
                type="age"
              />
              <Text style={tw("text-xl text-gray-700 px-4 mt-6 font-bold")}>
                Select as many as you want from below
              </Text>
              <View style={{ padding: 10 }}>
                <TagSelect ref={tag} data={data} theme="info" />
              </View>

              <View style={tw("w-full justify-center items-center mt-6 mb-6")}>
                <TouchableOpacity
                  onPress={() => SaveUserInfo()}
                  style={[
                    tw("w-40 justify-center items-center rounded-full"),
                    { backgroundColor: "#fe5642" },
                  ]}
                >
                  <Text style={tw("text-white font-bold text-2xl p-3")}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          }
          scrollEnabled={true}
          data={images}
          style={{ flex: 1 }}
          renderItem={({ item, index }) => (
            <View style={styles.imageContainerStyle}>
              <TouchableOpacity
                key={item}
                style={{ flex: 1 }}
                onPress={() => {
                  showImageModal(index);
                }}
              >
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri: item,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          //Setting the number of column
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  titleStyle: {
    padding: 16,
    fontSize: 20,
    color: "white",
    backgroundColor: "green",
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: "100%",
  },
  fullImageStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "98%",
    resizeMode: "contain",
  },
  modelStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 50,
    right: 20,
    position: "absolute",
  },

  item: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#FFF",
  },
  label: {
    color: "#333",
  },
  itemSelected: {
    backgroundColor: "#fe5642",
  },
  labelSelected: {
    color: "#FFF",
  },
  Video: {
    height: 300,
    width: 300,
  },
});

export default ModalScreen;
