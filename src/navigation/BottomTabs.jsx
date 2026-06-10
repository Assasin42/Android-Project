import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import HomeScreen from "../screens/HomeScreen.js";
import ProfileScreen from "../screens/profileScreen.js";
import SettingsScreen from "../screens/settingsScreen.js";
import ChangePasswordScreen from "../screens/ChangePasswordScreen.js";
import MapScreen from "../screens/MapScreen.js";
import CameraScreen from "../screens/CameraScreen.js";
import { AppColors } from "../styles/colors.js";
import { useTranslation } from "react-i18next";
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SettingsStack({ route }) {
  const { user, setUserData } = route.params || {};
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        initialParams={{ user }}
      />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
}

function HomeStack({ route }) {
  const { name } = route.params || {};
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        initialParams={{ name }}
      />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen 
        name="CameraScreen" 
        component={CameraScreen} 
        options={{ 
          headerShown: true, 
          title: "Kamera İşlemleri",
          headerTintColor: AppColors.light_orange,
          headerStyle: { backgroundColor: AppColors.black0_8 },
          headerTransparent: false
        }}
      />
      {/* ✅ Profile ve Ayarlar ekranlarını HomeStack'e ekleyin */}
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Ayarlar" 
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator({ user, setUserData }) {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: AppColors.light_orange,
        headerTransparent: true,
        tabBarActiveTintColor: AppColors.light_orange,
        headerStyle: { backgroundColor: "transparent" },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: AppColors.black0_8,
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
        name={t("tabs.home")}
        component={HomeStack}
        initialParams={{ name: user?.name || "Yolcu" }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={AppColors.light_orange}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name={t("tabs.profile")}
        component={ProfileScreen}
        initialParams={{ user, setUserData }}
        options={{
          headerTitleAlign: "center",
          headerTintColor: AppColors.dark_blue,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              color={AppColors.light_orange}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name={t("tabs.settings")}
        component={SettingsStack}
        initialParams={{ user, setUserData }}
        options={{
          headerShown: false,
          headerTintColor: AppColors.black3,
          headerTitleAlign: "center",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              color={AppColors.light_orange}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}