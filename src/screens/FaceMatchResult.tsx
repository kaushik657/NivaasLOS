import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
} from "react-native";
import AppButton from "../components/Button";
import { Colors } from "../constants/colors";
import { runLivenessCheck } from "../services/LivenessApi";
import { ScreenNames } from "../navigation/AppNavigator";
import CircularImage from "../components/CircularImage";
import { faceMatch } from "../services/FaceMatch";
import Loader from "../components/Loader";
import { showSuccessToast, showErrorToast } from "../utils/ToastUtils";
import { SendFaceMatchDataToSf } from "../services/PushToSalesforce";
const { width, height } = Dimensions.get("window");
interface Props {
  navigation: any;
  route: any;
}
export const FaceMatchResult = ({ route, navigation }: Props) => {
  const [loader, setLoader] = React.useState(false);
  const [faceMatched, setFaceMatched] = React.useState(false);
  const { photos } = route.params || {};
  const lastPhoto = photos?.[photos.length - 1];
  console.log("Photo URI:", lastPhoto);
  const Isliveness = useRef(false);

  // useEffect(()=>{
  //     if(lastPhoto){
  //         Isliveness.current = true;
  //         livenessCheck();
  //     }
  // },[lastPhoto])
  const livenessCheck = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    try {
      console.log("Starting face match with photo:", lastPhoto?.photoPath);

      setLoader(true);
      const resp = await faceMatch(lastPhoto?.photoPath, lastPhoto?.photoPath);
      if (resp?.result?.verified) {
        setFaceMatched(true);
        showSuccessToast("Face has been matched", resp?.result?.message);
      }
      console.log(resp.data);
      const sfresult = await SendFaceMatchDataToSf(resp);
      console.log("sfresultt", sfresult);

      console.log("face match", resp);
      setLoader(false);
      //navigation.navigate("LivenessResult", { result: resp });
    } catch (err) {
      setLoader(false);
      console.error("Liveness check failed:", err);
      // navigation.navigate("LivenessResult", { result: { error: true } });
    } finally {
      clearTimeout(timeout);
      showErrorToast("Liveness check timed out");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loader} />
      {faceMatched ? (
        <>
          <Text style={[styles.textStyle, { fontSize: 27, fontWeight: "600" }]}>
            Verified Face
          </Text>
          <Text style={[styles.textStyle, { fontSize: 16 }]}>
            Face has been matched
          </Text>
        </>
      ) : (
        <>
          <Text style={[styles.textStyle, { fontSize: 27, fontWeight: "600" }]}>
            Verifying Face...
          </Text>
        </>
      )}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CircularImage
          source={{ uri: `file://${lastPhoto?.photoPath}` }}
          size={120}
          borderWidth={3}
          borderColor={Colors.PRIMARY}
        />
      </View>
      <View style={styles.btnContainer}>
        <AppButton
          style={styles.btnStyle}
          title="Save"
          onPress={() => {
            livenessCheck();
          }}
        />
        <AppButton
          textStyle={{ color: Colors.PRIMARY }}
          style={[
            styles.btnStyle,
            {
              backgroundColor: "transparent",
              borderColor: Colors.PRIMARY,
              borderWidth: 1,
            },
          ]}
          title="Try Again"
          onPress={() => {
            navigation.pop();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  btnStyle: {
    width: width - 40,
    marginBottom: 10,
  },
  btnContainer: {
    position: "absolute",
    bottom: 0,
    padding: 8,
    //backgroundColor:'red'
  },
});
