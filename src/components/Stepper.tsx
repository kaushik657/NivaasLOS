import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const steps = [
  { label: "QDE", completed: true },
  { label: "Credit Evaluation", completed: false },
  { label: "Approval", completed: false },
  { label: "Disbursement", completed: false },
];

const greenImage = require("../assets/success.png");
const grayImage = require("../assets/not_started.png");

export default function Stepper() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {steps.map((step, index) => (
        <ImageBackground
          key={index}
          source={step.completed ? greenImage : grayImage}
          style={styles.stepImage}
          resizeMode="stretch"
        >
          <View style={styles.content}>
            {/* ✅ Checkmark on completed steps */}
            {step.completed && (
              <Icon
                name="check"
                size={16}
                color="#fff"
                style={styles.checkIcon}
              />
            )}
            <Text
              style={[
                styles.label,
                step.completed ? styles.labelActive : styles.labelInactive,
              ]}
              numberOfLines={1}
            >
              {step.label}
            </Text>
          </View>
        </ImageBackground>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    marginBottom: 10,
  },
  stepImage: {
    width: 140, // adjust to fit your image
    height: 36, // reduced height
    justifyContent: "center",
    marginRight: 6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  checkIcon: {
    marginRight: 6,
  },
  label: { fontFamily: "Montserrat-Regular", fontSize: 13, fontWeight: "500" },
  labelActive: {
    color: "#fff",
  },
  labelInactive: {
    color: "#000",
  },
});
