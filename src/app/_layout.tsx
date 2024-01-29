import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useAppFonts } from '../../src/functionality/loadFonts';
import * as Linking from 'expo-linking';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  const router=useRouter();
  useEffect(function linkingWorkaround() {
		Linking.addEventListener('url', ({ url }) => {
      const regex = /^noosk:\/\/(.*)|https:\/\/noosk\.co\/(.*)/;
        const match = url.match(regex);
        if (match) {
            const path = match[1] || match[2];
            router.push(path);
        }
		});
	}, []);
  

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // or a splash/loading screen
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(registration)" options={{ headerShown: false }} />
      <Stack.Screen name="postcreation/createpost" options={{ headerShown: false }} />
      <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="postfull/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="community/[id]" options={{ headerShown: false }} />      
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="postcreation/createrequest" options={{ headerShown: false }} />
      <Stack.Screen name="request/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="requestresponse/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/intro" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/categories" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/spotlight" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/interests" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/createusername" options={{ headerShown: false }} />      
      <Stack.Screen name="onboarding/setupprofile" options={{ headerShown: false }} />      
      <Stack.Screen name="onboarding/userverification" options={{ headerShown: false }} />            
      <Stack.Screen name="privacy_policy" options={{ headerShown: false }} />            
      <Stack.Screen name="publicfeed" options={{ headerShown: false }} />            
      <Stack.Screen name="start_discussion" options={{ headerShown: false, presentation: 'modal', }} /> 

      </Stack>
    </ThemeProvider>
  )
}
