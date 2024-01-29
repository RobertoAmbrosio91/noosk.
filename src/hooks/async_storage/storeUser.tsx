import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "../../types";

const storeUserData = async (user: UserData): Promise<void> => {
  try {
    const userString = JSON.stringify(user);
    await AsyncStorage.setItem("user", userString);
    // console.log("User data stored successfully!");
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export default storeUserData;

