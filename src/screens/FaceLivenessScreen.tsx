import { SafeAreaView } from "react-native"
import FaceLivenessFlow from "../components/LivenessProgressCamera"
import React from "react"
import { ScreenNames } from "../navigation/AppNavigator"
interface Props {
    navigation:any
}
export const FaceLivenessScreen = ({navigation}:Props) => {
    return (
        <FaceLivenessFlow steps={["center", "turnRight", "turnLeft"]}
        onComplete={(photos) => {
          navigation.navigate(ScreenNames.LIVELINESS_RESULT, { photos });
        }} />
    )
}