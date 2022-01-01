import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { View, Text, Modal, Switch, TouchableOpacity } from "react-native";
import tw from "tailwind-rn";
import { Picker } from "@react-native-picker/picker";
import { Entypo } from "@expo/vector-icons";

const SettingsModal = ({ settingsModalVisible, setSettingsModalVisible }) => {
  const [sliderAge, setSliderAge] = useState(18);
  const [selectedGender, setSelectedGender] = useState();

  const SaveSettings = () => {
    setSettingsModalVisible(false);
  };
  return (
    <Modal
      animationType="slide"
      visible={settingsModalVisible}
      transparent={true}
    >
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <View
          style={{
            justifyContent: "center",
            width: "95%",
            backgroundColor: "#f2f2f2",
            borderRadius: 12,
            borderColor: "rgba(232, 40, 95, 1)",
            borderWidth: 2,
            padding: 10,
            position: "relative"
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", zIndex: 11, right: 10, top: 10 }}
            onPress={() => setSettingsModalVisible(false)}
          >
            <Entypo
              name="cross"
              size={36}
              color="rgba(232, 40, 95, 1)"
              style={{}}
            />
          </TouchableOpacity>
          <Text style={tw("text-lg font-bold mb-5")}>Discovery Settings</Text>
          <View
            style={[
              tw("mb-3 relative"),
              {
                backgroundColor: "#fff",
                flexDirection: "row",
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRadius: 6,
              },
            ]}
          >
            <Text style={tw("text-lg")}>Location</Text>
            <Text
              style={[
                tw("text-lg"),
                {
                  color: "#ff4458",
                  fontWeight: "700",
                  right: 10,
                  position: "absolute",
                  top: 20,
                },
              ]}
            >
              My current Location
            </Text>
          </View>

          <View
            style={[
              tw("mb-3 relative"),
              {
                backgroundColor: "#fff",
                flexDirection: "row",
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRadius: 6,
              },
            ]}
          >
            <Text style={tw("text-lg")}>Global</Text>
            <Switch
              trackColor={{ true: "#f2f2f2", false: "#f2f2f2" }}
              thumbColor="rgba(232, 40, 95, 1)"
              ios_backgroundColor="#fff"
              style={{ position: "absolute", top: 20, right: 10 }}
              value={true}
              // onValueChange={toggleSwitch}
              // value={isEnabled}
            />
          </View>

          <View
            style={[
              tw("mb-3 relative"),
              {
                backgroundColor: "#fff",
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRadius: 6,
              },
            ]}
          >
            <Text
              style={[
                tw("text-xl"),
                { color: "rgba(232, 40, 95, 1)", fontWeight: "600" },
              ]}
            >
              Age Range
            </Text>
            <Text
              style={[
                tw("text-lg"),
                {
                  color: "#ff4458",
                  fontWeight: "700",
                  right: 10,
                  position: "absolute",
                  top: 20,
                },
              ]}
            >
              18 - {sliderAge}
            </Text>
            <View style={{ alignItems: "stretch", justifyContent: "center" }}>
              <Slider
                style={{ width: "100%", height: 80 }}
                minimumValue={18}
                maximumValue={100}
                minimumTrackTintColor="#f2f2f2"
                maximumTrackTintColor="rgba(232, 40, 95, 1)"
                thumbImage={require("../images/applogosmall.png")}
                value={sliderAge}
                step={1}
                onValueChange={(value) => setSliderAge(value)}
              />
            </View>
          </View>
          <View
            style={[
              tw("mb-3 relative"),
              {
                backgroundColor: "#fff",
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRadius: 6,
              },
            ]}
          >
            <Text
              style={[
                tw("text-xl"),
                { color: "rgba(232, 40, 95, 1)", fontWeight: "600" },
              ]}
            >
              Show me
            </Text>
            <Picker
              selectedValue={selectedGender}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedGender(itemValue)
              }
            >
              <Picker.Item label="Everyone" value="everyone" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
          <View style={tw("w-full justify-center items-center mt-6 mb-6")}>
            <TouchableOpacity
              onPress={() => SaveSettings()}
              style={[
                tw("w-40 justify-center items-center rounded-full"),
                { backgroundColor: "#fe5642" },
              ]}
            >
              <Text style={tw("text-white font-bold text-2xl p-3")}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsModal;
