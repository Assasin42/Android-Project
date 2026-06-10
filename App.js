import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
import { View, ActivityIndicator } from "react-native";
import "react-native-gesture-handler";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import TabNavigator from "./src/navigation/BottomTabs";

// Navigasyon mantığı ayrı bileşene taşındı (Provider içinde olması şart)
function AppNavigator() {
  const [isRegistering, setIsRegistering] = useState(false);

  // userData yerine Redux'tan okuyoruz
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user); // TabNavigator'a geçmek için

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // user prop'u aynen devam ediyor, TabNavigator değişmiyor
        <TabNavigator user={user} />
      ) : isRegistering ? (
        <RegisterScreen setIsRegistering={setIsRegistering} />
      ) : (
        // setUserData artık yok, LoginScreen sadece setIsRegistering alıyor
        <LoginScreen setIsRegistering={setIsRegistering} />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
