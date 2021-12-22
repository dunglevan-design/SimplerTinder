import { createContext, useContext, useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import auth from "@react-native-firebase/auth";

const AuthContext = createContext({
  user: null,
  SignInWithGoogle: null,
  logout: null,
});

WebBrowser.maybeCompleteAuthSession();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "117054791856-15itt386dr3tjtt6epaetj5oh07af474.apps.googleusercontent.com",
  });

  const SignInWithGoogle = async () => {
    promptAsync();
  };

  const logout = () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  const onAuthStateChanged = (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(response);
    if (response?.type === "success") {
      const { authentication } = response;
      //   console.log(response);
      const { idToken, accessToken } = authentication;
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );

      auth()
        .signInWithCredential(credential)
        .then((response) => {
          console.log(response);
        });
    }
  }, [response]);

  return (
    <AuthContext.Provider value={{ user: user, SignInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
