// components/CircularImage.tsx
import React from "react";
import { Image, StyleSheet, View, ImageSourcePropType } from "react-native";

interface CircularImageProps {
  source: ImageSourcePropType;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
}

export default function CircularImage({
  source,
  size = 100,
  borderWidth = 2,
  borderColor = "#fff",
}: CircularImageProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor,
        },
      ]}
    >
      <Image
        source={source}
        style={{
          width: size - borderWidth * 2,
          height: size - borderWidth * 2,
          borderRadius: (size - borderWidth * 2) / 2,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
