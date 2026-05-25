import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import HomeScreen from "../screens/HomeScreen.js";
import ProfileScreen from "../screens/profileScreen.js";
import SettingsScreen from "../screens/settingsScreen.js";
import ChangePasswordScreen from "../screens/ChangePasswordScreen.js";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SettingsStack({ route }) {
  const { user, setUserData } = route.params || {};
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} initialParams={{ user }} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator({ user, setUserData }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: "#FEF3E2",
        headerTransparent: true,
        tabBarActiveTintColor: "#FEF3E2",
        headerStyle: { backgroundColor: "transparent" },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "rgba(0,0,0,0.8)",
          position: "absolute",
          elevation: 0,
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <BlurView intensity={50} style={{ flex: 1 }} tint="dark" />
        ),
      }}
    >
      <Tab.Screen
        name="Duraklar"
        component={HomeScreen}
        initialParams={{ name: user?.name || "Yolcu" }}
        options={{
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={"#FEF3E2"} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user, setUserData }}
        options={{
          headerTitleAlign: "center",
          headerTintColor: "#020102",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "person-sharp" : "person-outline"} color={"#f3f3ee"} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Ayarlar"
        component={SettingsStack}
        initialParams={{ user, setUserData }}
        options={{
          headerShown: false,
          headerTintColor: "#020102",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "settings-sharp" : "settings-outline"} color={"#FEF3E2"} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}