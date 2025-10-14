import React, { forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { verticalScale, moderateScale } from "react-native-size-matters";
import { openGoogleMaps } from "../services/location/LocationHelper";
import ThreeDotMenu from "./ThreeDotMenu";
import { MenuProvider } from "react-native-popup-menu";

interface Props {
  data: any[];
  setData: (data: any[]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  simultaneousHandlers?: any;
}

const NewFlatlist = forwardRef<any, Props>(
  ({ data, setData, onDragStart, onDragEnd, simultaneousHandlers }, ref) => {
    if (!data || !Array.isArray(data)) return null;

    console.log("Rendering NexFlatlist with data:", data);

    const renderItem = ({ item, drag, isActive }: any) => (
      <ScaleDecorator>
        <View
          style={[
            styles.itemContainer,
            {
              borderLeftColor: item.color || "#ccc",
              backgroundColor: isActive ? "#e0f2fe" : "#f9fafb",
            },
          ]}
        >
          <View style={styles.row}>
            {/* Drag handle */}
            <TouchableOpacity
              onLongPress={drag}
              delayLongPress={200}
              style={{ padding: 12 }}
            >
              <MaterialIcons name="swap-vert" size={20} color="#6b7280" />
            </TouchableOpacity>

            {/* Item content */}
            <View style={{ flex: 1.5, paddingLeft: 10 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>
                {item.type} • {item.time}
              </Text>
            </View>
            {/* <FontAwesome5
              name="directions"
              size={20}
              color="#6b7280"
              onPress={() => handleStartNavigation(item)}
            /> */}
            <View style={{ position: "absolute", right: 10, top: 10 }}>
              <ThreeDotMenu item={item} />
            </View>
          </View>
        </View>
      </ScaleDecorator>
    );

    return (
      <View style={styles.container}>
        {/* Title on top */}
        <Text style={styles.title}>Optimized Meeting Order</Text>
        <GestureHandlerRootView>
          <MenuProvider>
            <DraggableFlatList
              ref={ref}
              data={data}
              scrollEnabled={false} // parent scroll
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              activationDistance={20} // drag only after movement
              onDragBegin={() => onDragStart && onDragStart()}
              onDragEnd={({ data }) => {
                setData(data);
                onDragEnd && onDragEnd();
              }}
              simultaneousHandlers={simultaneousHandlers} // fixes extreme edges issue
            />
          </MenuProvider>
        </GestureHandlerRootView>
      </View>
    );
  }
);

export default NewFlatlist;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    marginVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: "#d1d5db", // light gray border
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    marginBottom: verticalScale(8),
    color: "#111827",
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 6,
    borderRadius: 10,
    borderLeftWidth: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  details: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});
