import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "./src/screens/LoginScreen"; 
import RegisterScreen from "./src/screens/RegisterScreen";
import TabNavigator from "./src/navigation/BottomTabs";

export default function App() {
  const [userData, setUserData] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <NavigationContainer>
      {userData ? (
        
        <TabNavigator user={userData} setUserData={setUserData} />
      ) : isRegistering ? (
        
        <RegisterScreen setIsRegistering={setIsRegistering} />
      ) : (
        
        <LoginScreen 
          setUserData={setUserData} 
          setIsRegistering={setIsRegistering} 
        />
      )}
    </NavigationContainer>
  );
}