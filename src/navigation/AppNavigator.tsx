import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../screens/DashboardScreen";
import { DocUploadScreen } from "../screens/DocUploadScreen";
import { FaceLivenessScreen } from "../screens/FaceLivenessScreen";
import { LivelinessResult } from "../screens/LivelinessResult";
import { FaceMatchScreen } from "../screens/FaceMatch";
import { FaceMatchResult } from "../screens/FaceMatchResult";
import RoutePlanScreen from "../screens/RoutePlanScreen";
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ScreenNames.DASHBOARD}
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
      <Stack.Screen name={ScreenNames.ROUTE_PLAN} component={RoutePlanScreen} />
    </Stack.Navigator>
  );
}
