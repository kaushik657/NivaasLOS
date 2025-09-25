import { SafeAreaView } from "react-native"
import FaceLivenessFlow from "../components/LivenessProgressCamera"
import React from "react"
import { ScreenNames } from "../navigation/AppNavigator"
interface Props {
    navigation:any
}
export const FaceMatchScreen = ({navigation}:Props) => {
    return (
        <FaceLivenessFlow steps={["center"]}
        onComplete={(photos) => {
          navigation.navigate(ScreenNames.FACE_MATCH_RESULT, { photos });
        }} />
    )
}