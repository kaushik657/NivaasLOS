import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RoutePlanScreen from "../screens/RoutePlanScreen";
import { Alert, Linking } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { scale } from "react-native-size-matters";
import { Colors } from "../constants/colors";
import { openSalesforce,handleSalesforceLogout } from "../helpers/helpers";
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
//screen names

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ScreenNames.ROUTE_PLAN}
    >
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
              onPress={openSalesforce}
            />
          ),
            headerRight: () => (
            <MaterialIcons
              name="logout"
              size={scale(24)}
              style={{ marginRight: scale(10), color: "black" }}
              onPress={handleSalesforceLogout}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
