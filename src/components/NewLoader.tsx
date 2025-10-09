import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  Image,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import LoaderKit from "react-native-loader-kit";

interface CommonLoaderProps {
  visible?: boolean;
  type?: string;
  color?: string;
  size?: number; // loader size
  backgroundColor?: string; // card background
  containerStyle?: ViewStyle;
}

const { width } = Dimensions.get("window");

const NewLoader: React.FC<CommonLoaderProps> = ({
  visible = true,
  type = "BallPulse",
  color = "#007AFF",
  size = width * 0.15, // 15% of screen width
  backgroundColor = "#fff",
  containerStyle,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.card,
          containerStyle,
          { backgroundColor, width: size * 2.5, height: size * 3 },
        ]}
      >
        <LoaderKit
          style={{ width: size, height: size }}
          name={type}
          color={color}
        />

        <Image
          source={require("../assets/niwas.png")}
          style={{ width: size * 1.4, height: size * 1.4, marginTop: 10 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default NewLoader;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.2)", // optional dim background
  },
  card: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5, // Android shadow
    padding: 10,
  },
});
