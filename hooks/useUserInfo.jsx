import { useEffect, useState, createContext, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import useAuth from "./useAuth";


const UserInfoContext = createContext({
  userInfo: {
    fullName: "",
    occupation: "",
    photoURL: "",
    age: 0,
    id: 0,
    tags: [],
  },
});

export const UserInfoProvider = ({ children }) => {
    const {user} = useAuth();
    const [userInfo, setUserInfo] = useState({});
    

    useEffect(() => {

        //first check if the user exist
        
        const unsubscribe = firestore()
        .collection('users')
        .doc(user?.uid)
        .onSnapshot(documentSnapshot => {
          setUserInfo({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        return unsubscribe;
    }, [user]);//



    return (
        <UserInfoContext.Provider value = {{userInfo}}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = () => {
    return useContext(UserInfoContext);
}