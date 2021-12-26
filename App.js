import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";
import { UserInfoProvider } from "./hooks/useUserInfo";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <UserInfoProvider>
          <StackNavigator />
        </UserInfoProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
