import React from 'react'
import { View, Text, Button, ImageBackground, Image } from "react-native";
import tw from "tailwind-rn";
import { TouchableOpacity } from "react-native";
import useAuth from '../hooks/useAuth';

export default function LoginScreen() {

    const { user, SignInWithGoogle } = useAuth();

    return (
        <View style={tw("flex-1 flex justify-center")}>
        <ImageBackground
          resizeMode="cover"
          style={tw("flex-1 z-0")}
          source={require("../images/loginbackground.png")}
      
        ></ImageBackground>

        <View style = {{position: "absolute", alignItems: "center", justifyContent: "center", alignContent: "center", width: "100%"}}>
          <Image source = {require("../images/applogoLogin.png")} />
        </View>
        <View style= {[tw("absolute bottom-40 left-1/4 w-1/2"), {}]}>

          <TouchableOpacity
            style={[tw("p-4 bg-white rounded-2xl"), {}]}
            onPress= {SignInWithGoogle}
          >
            <Text style={tw("font-bold text-center text-black")}>
              Sign in & get swiping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
}
