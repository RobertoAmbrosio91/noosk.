import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme, Platform } from 'react-native';


/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        headerShown: false,
        tabBarStyle: {
          maxWidth: 800,
          width: "100%",
          alignSelf: "center",
          backgroundColor: "#000",
        }
      }}>
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: false,
          title: 'Feed',
          tabBarIcon: ({ color }) => <TabBarIcon name="albums-outline" color={color} />,
        }}
      />
      <Tabs.Screen
  name="creationhub"
  options={{
    title: "Creation Hub",
    tabBarIcon: ({ color }) => <TabBarIcon name="bulb-outline" color={color} />,
  }}
/>
<Tabs.Screen
  name="profile"
  options={{
    title: "Profile",
    tabBarIcon: ({ color }) => <TabBarIcon name="md-person-outline" color={color} />,
  }}
/>
    </Tabs>
  );
}