import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator, { ScreenNames } from "./AppNavigator";
import Toast from "react-native-toast-message";

const linking = {
  prefixes: ["shubhma_shf://"],
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
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </>
  );
}
