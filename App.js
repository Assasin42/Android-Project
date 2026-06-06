import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useSelector, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
import { SheetProvider } from "react-native-actions-sheet";
import { View, ActivityIndicator } from "react-native";
import './src/i18n/i18nConfig'; 

// ✅ i18n başlat (uygulama açılırken bir kez çalışır)
import "./src/i18n/i18nConfig";

// ✅ LanguageSheet'i kaydet (import etmek yeterli)
import "./src/components/LanguageSheet";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import TabNavigator from "./src/navigation/BottomTabs";

function AppNavigator() {
  const [isRegistering, setIsRegistering] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  return (
    // ✅ SheetProvider: LanguageSheet (ve diğer sheet'ler) için gerekli
    <SheetProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <TabNavigator user={user} />
        ) : isRegistering ? (
          <RegisterScreen setIsRegistering={setIsRegistering} />
        ) : (
          <LoginScreen setIsRegistering={setIsRegistering} />
        )}
      </NavigationContainer>
    </SheetProvider>
  );
}

// ✅ Provider ve PersistGate SADECE burada — index.js'de tekrarlanmıyor
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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