import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { SheetProvider } from "react-native-actions-sheet";
import './src/i18n/i18nConfig';
import "./src/sheets";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import TabNavigator from "./src/navigation/BottomTabs";

function AppNavigator() {
  const [isRegistering, setIsRegistering] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <TabNavigator user={user} />
      ) : isRegistering ? (
        <RegisterScreen setIsRegistering={setIsRegistering} />
      ) : (
        <LoginScreen setIsRegistering={setIsRegistering} />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    // SheetProvider tüm uygulamayı sarmalıyor — sheet'lerin render olması için şart
    <SheetProvider>
      <AppNavigator />
    </SheetProvider>
  );
}