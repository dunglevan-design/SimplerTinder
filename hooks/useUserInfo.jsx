import { useEffect, useState, createContext, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import useAuth from "./useAuth";

const DUMMY_DATA = [
  {
    fullName: "Elon Musk",
    occupation: "software engineer",
    photoURL:
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg",
    age: 45,
    id: 123,
    tags: ["Nooby", "Hailer", "Stripper", "CEO", "Nothing at all"],
  },
  {
    fullName: "alane Mulan",
    occupation: "software engineer",
    photoURL:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh5mmILTkRwAc266VWD17KfsQL9nk1RuYjEyN9WMzkmOaJxYhq8hIJn5edKcYoEk80VPI&usqp=CAU",
    age: 35,
    id: 456,
    tags: ["guitarist", "randomshit", "lover", "flirter"],
  },
  {
    fullName: "Jun Le",
    occupation: "software engineer boss",
    photoURL:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/60045428_1180040428834922_7963564425636478976_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=3MRSMXBrGNEAX8EBP19&_nc_ht=scontent.fhan2-4.fna&oh=3f23c56b7d613e36f1145e5051276e4d&oe=61CC248B",
    age: 20,
    id: 789,
    tags: ["handsome", "chaser", "solver", "football"],
  },
];

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