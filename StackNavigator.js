import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import LoginScreen from "./screens/LoginScreen";
import useAuth from "./hooks/useAuth";
import ModalScreen from "./screens/ModalScreen";
import Header from "./components/ProfileHeader";
import MatchScreen from "./screens/MatchScreen";
import { Chatroom } from "./screens/ChatRoom";


const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{headerShown:false, animation: "slide_from_right"}}/>
            <Stack.Screen name="ChatRoom" component={Chatroom} options={{headerShown:false, animation: "slide_from_right"}}/>
            
          </Stack.Group>
          <Stack.Group screenOptions={{presentation:  "fullScreenModal"}}>
            <Stack.Screen name = "Profile" component={ModalScreen} options={{headerShown: true, headerTitleAlign: "center", headerShadowVisible: false}}></Stack.Screen>
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: "containedTransparentModal"}}>
            <Stack.Screen name = "Match" component= {MatchScreen} options={{headerShown: false}} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
