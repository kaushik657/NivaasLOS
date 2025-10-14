import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Icon from "react-native-vector-icons/Feather"; // You can use MaterialIcons or Entypo too
import { openGoogleMaps } from "../services/location/LocationHelper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { openSalesforceOne } from "../helpers/helpers";

const ThreeDotMenu = (item: any) => {
  const handleStartNavigation = (item: any) => {
    console.log("Navigating to:", item);

    openGoogleMaps(item.item.latitude, item.item.longitude);
  };
  return (
    <View style={styles.container}>
      <Menu rendererProps={{ placement: "auto" }}>
        {/* 👇 Three-dot trigger icon */}
        <MenuTrigger>
          <Icon name="more-vertical" size={24} color="#000" />
        </MenuTrigger>

        {/* 👇 Menu Options */}
        <MenuOptions
          customStyles={{
            optionsContainer: {
              position: "absolute",
              padding: 8,
              paddingBottom: 20,
              // marginBottom: 20,
              borderRadius: 8,
              backgroundColor: "lightgray",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
            },
          }}
        >
          <MenuOption onSelect={() => openSalesforceOne()}>
            <Text style={styles.optionText}>Back TO SF</Text>
          </MenuOption>
          <MenuOption onSelect={() => handleStartNavigation(item)}>
            <Text style={styles.optionText}>Google Maps</Text>
            <FontAwesome5
              name="directions"
              size={20}
              color="#6b7280"
              onPress={() => handleStartNavigation(item)}
            />
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 6,
  },
});

export default ThreeDotMenu;
