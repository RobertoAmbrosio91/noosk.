import "../../firebaseInit"


if (typeof requestAnimationFrame === 'undefined') {
  let lastId = 0;
  const ids = new Map<number, NodeJS.Timeout>();

  global.requestAnimationFrame = (callback) => {
    const id = ++lastId;
    const timeoutId = setTimeout(() => {
      ids.delete(id);
      callback(Date.now());
    }, 0);
    ids.set(id, timeoutId);
    return id;
  };

  global.cancelAnimationFrame = (id) => {
    const timeoutId = ids.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      ids.delete(id);
    }
  };
}

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import useFetchUserDataAsync from '../hooks/async_storage/useFetchUserDataAsync';
import { useFCMHandler } from '@/hooks/fcm_token/FCMHandler';
import refreshToken from "@/hooks/users/refreshToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const InitialRouteHandler = () => {
  const router = useRouter();
  const currentUser = useFetchUserDataAsync();
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);

  const isWeb = Platform.OS === 'web';

type UseFCMHandlerFunction = () => void;
let useFCMHandler: UseFCMHandlerFunction | undefined;

if (!isWeb) {
  // Require the useFCMHandler hook and assert its type
  useFCMHandler = require('@/hooks/fcm_token/FCMHandler').useFCMHandler as UseFCMHandlerFunction;
}

  if (useFCMHandler) {
    useFCMHandler();
  } else {
    console.log('InitialRouteHandler: useFCMHandler not available on this platform');
  }

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };


  const fetchAndRefresh = async () => {
    if (currentUser) {
      try {
        await refreshToken(currentUser.token);
      } catch (error) {
        console.log("Error refreshing the token", error);
        await clearAllData();
        setTokenExpired(true);
      }
    }
  };

  useEffect(() => {
    const checkUserAndToken = async () => {
      if (currentUser === undefined) {
        return;
      }

      if (currentUser === null && !isWeb) {
        router.replace('/landing');
        return;
      }
      if(isWeb && currentUser === null){
        router.replace('/publicfeed');
        return;
      }

      await fetchAndRefresh();

      if (!tokenExpired && currentUser) {
        const sharer = currentUser.user_type === "sharer";
        const watcher = currentUser.user_type === "watcher";
        let route;
        if (sharer && currentUser.subcategory_id.length < 1) {
          route = '/onboarding/categories';
        } else if (sharer && (!currentUser.first_name || !currentUser.last_name)) {
          route = '/onboarding/setupprofile';
        } else if (watcher && !currentUser.user_name) {
          route = '/onboarding/createusername';
        } else {
          route = sharer ? '/creationhub' : '/feed';
        }
        router.replace(route);
      }
    };

    checkUserAndToken();
  }, [currentUser]);

  useEffect(() => {
    if (tokenExpired) {
      router.replace('/landing');
    }
  }, [tokenExpired]);

  return null;
};




export default InitialRouteHandler;