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
import { showSuccessToast, showErrorToast } from "../utils/ToastUtils";
import Loader from "../components/Loader";
const { width, height } = Dimensions.get("window");
interface Props {
  navigation: any;
  route: any;
}
export const LivelinessResult = ({ route, navigation }: Props) => {
  const { photos } = route.params || {};
  const [loading, setLoading] = React.useState(false);
  const lastPhoto = photos?.[photos.length - 1];
  console.log("Photo URI:", lastPhoto);
  const Isliveness: any = useRef(false);

  useEffect(() => {
    if (!Isliveness.current && lastPhoto?.photoPath) {
      Isliveness.current = true;
      livenessCheck();
    }
  }, [lastPhoto]);
  const livenessCheck = async () => {
    try {
      setLoading(true);
      const resp = await runLivenessCheck(lastPhoto.photoPath);
      console.log("Liveness check response:", resp);

      setLoading(false);

      showSuccessToast(
        "Liveness Check Successful",
        "The liveness check was completed successfully."
      );

      //navigation.navigate("LivenessResult", { result: resp });
    } catch (err) {
      setLoading(false);
      console.error("Liveness check failed:", err);
      showErrorToast(
        "Liveness Check Failed",
        "There was an error during the liveness check. Please try again."
      );
      // navigation.navigate("LivenessResult", { result: { error: true } });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <Text style={[styles.textStyle, { fontSize: 24 }]}>
        Liveliness Result!
      </Text>
      <Text style={[styles.textStyle, { fontSize: 16 }]}>
        Result: Check Successful
      </Text>
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
          textStyle={{ color: Colors.PRIMARY }}
          style={[
            styles.btnStyle,
            {
              backgroundColor: "transparent",
              borderColor: Colors.PRIMARY,
              borderWidth: 1,
            },
          ]}
          title="Save"
          onPress={() => {}}
        />
        <AppButton
          style={styles.btnStyle}
          title="Go Back"
          onPress={() => {
            navigation.navigate(ScreenNames.DASHBOARD);
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
    //justifyContent:'center'
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
