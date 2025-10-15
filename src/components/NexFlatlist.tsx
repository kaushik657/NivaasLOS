import React, { forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { verticalScale, moderateScale } from "react-native-size-matters";
import ThreeDotMenu from "./ThreeDotMenu";

interface Item {
  id: string;
  name: string;
  type: string;
  time: string;
  color?: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

interface Props {
  data: Item[];
  setData: (data: Item[]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  simultaneousHandlers?: any;
}

const NewFlatlist = forwardRef<any, Props>(
  ({ data, setData, onDragStart, onDragEnd, simultaneousHandlers }, ref) => {
    if (!data || !Array.isArray(data)) return null;

    const renderItem = ({
      item,
      drag,
      isActive,
    }: {
      item: Item;
      drag: () => void;
      isActive: boolean;
    }) => (
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

            <View
              style={{
                flex: 0.3,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <ThreeDotMenu item={item} />
            </View>
          </View>
        </View>
      </ScaleDecorator>
    );

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Optimized Meeting Order</Text>
        <GestureHandlerRootView>
          <DraggableFlatList
            ref={ref}
            data={data}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            activationDistance={20}
            onDragBegin={() => onDragStart && onDragStart()}
            onDragEnd={({ data }) => {
              setData(data);
              onDragEnd && onDragEnd();
            }}
            simultaneousHandlers={simultaneousHandlers}
          />
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
    borderColor: "#d1d5db",
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
