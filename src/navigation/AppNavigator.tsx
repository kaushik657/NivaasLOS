import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../screens/DashboardScreen";
import { DocUploadScreen } from "../screens/DocUploadScreen";
import { FaceLivenessScreen } from "../screens/FaceLivenessScreen";
import { LivelinessResult } from "../screens/LivelinessResult";
import { FaceMatchScreen } from "../screens/FaceMatch";
import { FaceMatchResult } from "../screens/FaceMatchResult";
import RoutePlanScreen from "../screens/RoutePlanScreen";
import { Alert, Linking } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import { Colors } from "../constants/colors";
// import { AppStackParamList } from "./types";

const Stack = createStackNavigator();

export enum ScreenNames {
  DASHBOARD = "Dashboard",
  DOC_UPLOAAD = "DocUpload",
  FACE_LIVENESS = "FaceLiveness",
  LIVELINESS_RESULT = "LivelinessResult",
  FACE_MATCH = "FaceMatch",
  FACE_MATCH_RESULT = "FaceMatchResult",
  ROUTE_PLAN = "RoutePlanScreen",
}

export default function AppNavigator() {
  const openSalesforceOne = async (): Promise<void> => {
    const leadId = "00QC400000GA6MHMA1"; // Replace with your actual Lead ID
    const url = `salesforce1://sObject/${leadId}/view`;

    try {
      // On Android, canOpenURL will now work correctly
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Salesforce One is not installed",
          "Please install Salesforce One from Play Store / App Store."
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Could not open Salesforce One");
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ScreenNames.ROUTE_PLAN}
    >
      <Stack.Screen name={ScreenNames.DASHBOARD} component={DashboardScreen} />
      <Stack.Screen
        name={ScreenNames.DOC_UPLOAAD}
        component={DocUploadScreen}
      />
      <Stack.Screen
        name={ScreenNames.FACE_LIVENESS}
        component={FaceLivenessScreen}
      />
      <Stack.Screen
        name={ScreenNames.LIVELINESS_RESULT}
        component={LivelinessResult}
      />
      <Stack.Screen name={ScreenNames.FACE_MATCH} component={FaceMatchScreen} />
      <Stack.Screen
        name={ScreenNames.FACE_MATCH_RESULT}
        component={FaceMatchResult}
      />
      <Stack.Screen
        name={ScreenNames.ROUTE_PLAN}
        component={RoutePlanScreen}
        options={{
          headerShown: true,
          title: "Route Plan",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: scale(18),
            color: "black",
          },
          headerLeft: () => (
            <Ionicons
              name="arrow-back-outline"
              size={scale(24)}
              style={{ marginLeft: scale(10), color: "black" }}
              onPress={openSalesforceOne}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
