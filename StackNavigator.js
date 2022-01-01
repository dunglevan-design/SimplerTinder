import React from "react";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import LoginScreen from "./screens/LoginScreen";
import useAuth from "./hooks/useAuth";
import ModalScreen from "./screens/ModalScreen";
import MatchScreen from "./screens/MatchScreen";
import { Chatroom } from "./screens/ChatRoom";
import TindererProfile from "./screens/TindererProfile";
import {createSharedElementStackNavigator}  from "react-navigation-shared-element";

const Stack = createSharedElementStackNavigator();

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
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="ChatRoom"
            component={Chatroom}
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="TindererProfile"
            component={TindererProfile}
            options={{ headerShown: false , presentation: "modal"}}
            sharedElements={(route) => {
              return [route.params.tinderer.id, `info${route.params.tinderer.id}`, `occupation${route.params.tinderer.id}`, `tags${route.params.tinderer.id}`];
            }}
          />
            <Stack.Screen name="Profile" component={ModalScreen}></Stack.Screen>
            <Stack.Screen
              name="Match"
              component={MatchScreen}
              options={{ headerShown: false }}
            />
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
