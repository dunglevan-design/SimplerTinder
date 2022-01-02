import { Text, TextInput } from "react-native";
import tw from "tailwind-rn";


export const InfoForm = ({ userInfo, type, setuserInfoState }) => {
    const setUserInfoBasedOntype = (userinfo, text, type) => {
      if (type === "fullName") {
        setuserInfoState({
          ...userinfo,
          fullName: text,
        });
      } else if (type === "age") {
        setuserInfoState({
          ...userinfo,
          age: text,
        });
      } else if (type === "occupation") {
        setuserInfoState({
          ...userinfo,
          occupation: text,
        });
      } else if (type === "photoURL") {
        setuserInfoState({
          ...userinfo,
          photoURL: text,
        });
      }
    };
  
    const ToValueBasedOntype = (userInfo, type) => {
      let value;
      if (type === "fullName") {
        value = userInfo?.fullName;
      } else if (type === "occupation") {
        value = userInfo?.occupation;
      } else if (type === "age") {
        value = userInfo?.age?.toString();
      } else if (type === "photoURL") {
        value = userInfo?.photoURL;
      }
  
      //   else if (type === "tags"){
      //       value = userInfo?.tags;
      //   }
      return value;
    };
  
    const TitleBasedOntype = (type) => {
      let title;
      if (type === "fullName") {
        title = "Full Name";
      } else if (type === "occupation") {
        title = "Occupation"
      } else if (type === "age") {
        title = "Age";
      } 
      return title;
    } 
    return (
      <>
        <Text style={tw("text-xl text-gray-700 px-4 mt-6 font-bold")}>
          {TitleBasedOntype(type)}
        </Text>
        <TextInput
          value={ToValueBasedOntype(userInfo, type)}
          onChangeText={(text) => setUserInfoBasedOntype(userInfo, text, type)}
          style={tw("text-xl bg-white py-3 px-4")}
        />
      </>
    );
  };