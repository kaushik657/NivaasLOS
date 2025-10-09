import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator, { ScreenNames } from "./AppNavigator";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const linking = {
  prefixes: ["niwaslos://"],
  config: {
    screens: {
      Dashboard: "dashboard",
      DocUpload: "docupload",
      FaceLiveness: "faceliveness",
    },
  },
};

export default function RootNavigator() {
  return (
    <>
      <NavigationContainer linking={linking} fallback={<></>}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </NavigationContainer>
      <Toast />
    </>
  );
}
