import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as MaterialMenu from "react-native-material-menu";
import Icon from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { openGoogleMaps } from "../services/location/LocationHelper";
import { openSalesforceOne } from "../helpers/helpers";

interface ThreeDotMenuProps {
  item: {
    Id: string;
    latitude: number;
    longitude: number;
    [key: string]: any;
  };
}

const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({ item }) => {
  const menuRef = useRef<MaterialMenu.Menu>(null);

  const showMenu = () => menuRef.current?.show();
  const hideMenu = () => menuRef.current?.hide();

  const handleOpenLead = () => {
    hideMenu();
    openSalesforceOne(item.id);
  };

  const handleNavigate = () => {
    hideMenu();
    openGoogleMaps(item.latitude, item.longitude);
  };

  console.log("this is sthe object here",item);
  

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity onPress={showMenu}>
        <Icon name="more-vertical" size={24} color="#4b5563" />
      </TouchableOpacity>

      {/* Menu */}
      <MaterialMenu.Menu
        ref={menuRef}
        style={styles.menu}
        animationDuration={150}
        onRequestClose={hideMenu} // for Android
        backHandler // ensures back button closes menu on Android
        onHidden={() => menuRef.current?.hide()} // extra safety
      >
        <MaterialMenu.MenuItem
          style={styles.optionRow}
          onPress={handleOpenLead}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[styles.optionText]}>Open Lead</Text>
            <Fontisto
              name="person"
              size={18}
              color="#4b5563"
              style={{ position: "absolute", left: 110 }}
            />
          </View>
        </MaterialMenu.MenuItem>

        <View style={styles.separator} />

        <MaterialMenu.MenuItem
          style={styles.optionRow}
          onPress={handleNavigate}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[styles.optionText, { flex: 1 }]}>Navigate</Text>
            <FontAwesome5
              name="directions"
              size={20}
              color="#6b7280"
              style={{ position: "absolute", left: 110 }}
            />
          </View>
        </MaterialMenu.MenuItem>
      </MaterialMenu.Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    borderRadius: 8,
    backgroundColor: "#fff",
    minWidth: 160,
    maxHeight: 200,
    paddingVertical: 0, // menu items handle padding
    elevation: 5,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // text left, icon right
  },
  optionText: {
    fontSize: 16,
    color: "#111827",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
});

export default ThreeDotMenu;
