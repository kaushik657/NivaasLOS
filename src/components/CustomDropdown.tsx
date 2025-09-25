import React, { useState, useRef } from "react";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/AntDesign";

interface CustomDropdownProps {
  title: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  title,
  children,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);

    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // down → up
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        disabled={disabled}
        style={styles.header}
        onPress={toggleDropdown}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Icon name="down" size={18} color="#333" />
        </Animated.View>
      </TouchableOpacity>

      {/* Collapsible Content */}
      <Collapsible collapsed={!isExpanded} enablePointerEvents={true}>
        <View style={styles.content}>{children}</View>
      </Collapsible>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: "#F1F1F1",
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    marginBottom: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(14),
    color: "#000",
  },
  content: {
    padding: moderateScale(6),
    backgroundColor: "#fff",
  },
});
