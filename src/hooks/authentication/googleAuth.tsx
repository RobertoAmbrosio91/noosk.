import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import googleSignup from "../users/googleSignup";
import * as AuthSession from 'expo-auth-session';

// Assuming these constants are defined in your environment configuration
const ANDROID_CLIENT_ID = "**************************************";
const IOS_CLIENT_ID = "**************************************";
const WEB_CLIENT_ID = "**************************************";

WebBrowser.maybeCompleteAuthSession();

const config = {
  androidClientId: ANDROID_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  webClientId: WEB_CLIENT_ID,
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest(config);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  // Function to get user info from the token
  const getUserInfo = async (token: any) => {
    console.log("Fetching user info with token:", token);
    if (!token) return;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Check if the response is not ok (status code outside of 2xx range)
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}: ${response.statusText}`);
      }
  
      const user = await response.json();
      console.log("Extracted user info:", user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to fetch user data:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };
  

  // Function to handle Google Sign-In
  const signInWithGoogle = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("user");
      if (userJSON) {
        setUserInfo(JSON.parse(userJSON));
      } else if (response?.type === "success") {
        getUserInfo(response.authentication?.accessToken);
      }
    } catch (error) {
      console.error("Error retrieving user data from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    signInWithGoogle();
  }, [response]);

  const onGoogleButtonPress = () => {
    console.log("Initiating Google Sign-In");
    promptAsync();
  };

  useEffect(() => {
    console.log("User info state updated:", userInfo);
    if (userInfo) {
      const { email, id, given_name, family_name } = userInfo;
      console.log("Sending to googleSignup:", {
        email: email, 
        social_id: id, 
        first_name: given_name, 
        last_name: family_name
      });
    // Call the googleSignup function with the correct field names
    googleSignup(email, id, given_name, family_name)
      .then(returnedUser => {
        console.log("Returned user:", returnedUser);
        if (returnedUser && returnedUser.success) {
          if (returnedUser.result.subcategory_id.length === 0) {
            router.push('/onboarding/intro');
          } else if (returnedUser.result.user_name !== "") {
            router.push('/');
          }
        }
      })
      .catch(error => {
        console.error("Error in googleSignup:", error);
      });
  }
}, [userInfo]);


  return { onGoogleButtonPress };
};

