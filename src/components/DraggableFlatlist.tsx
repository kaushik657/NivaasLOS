import React, { useRef, useState } from "react";
import {
  FlatList,
  View,
  PanResponder,
  StyleSheet,
  Animated,
  LayoutRectangle,
  Text,
} from "react-native";
import { verticalScale, moderateScale } from "react-native-size-matters";

interface DraggableFlatListProps<T> {
  data: T[];
  renderItem: (
    item: T,
    index: number,
    isDragging: boolean
  ) => React.ReactElement;
  keyExtractor: (item: T) => string;
  itemHeight: number;
  onDragBegin?: () => void;
  onDragEnd?: (data: T[]) => void;
}

export const DraggableFlatList = <T,>({
  data,
  renderItem,
  keyExtractor,
  itemHeight,
  onDragBegin,
  onDragEnd,
}: DraggableFlatListProps<T>) => {
  const draggingIndex = useRef<number | null>(null);
  const listTop = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dragY] = useState(new Animated.Value(0));
  const [dragStartOffset, setDragStartOffset] = useState(0);

  const createPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        draggingIndex.current = index;
        setActiveIndex(index);
        onDragBegin && onDragBegin();

        const offset = gestureState.y0 - listTop.current - index * itemHeight;
        setDragStartOffset(offset);

        dragY.setValue(gestureState.y0 - listTop.current - offset);
      },
      onPanResponderMove: (_, gestureState) => {
        if (draggingIndex.current === null) return;

        dragY.setValue(gestureState.moveY - listTop.current - dragStartOffset);

        const absoluteY =
          gestureState.moveY - listTop.current - dragStartOffset;
        const toIndex = Math.min(
          data.length - 1,
          Math.max(0, Math.floor(absoluteY / itemHeight))
        );

        const fromIndex = draggingIndex.current;
        if (fromIndex !== toIndex) {
          const updated = [...data];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          draggingIndex.current = toIndex;
          setActiveIndex(toIndex);
          onDragEnd && onDragEnd(updated);
        }
      },
      onPanResponderRelease: () => {
        draggingIndex.current = null;
        setActiveIndex(null);
      },
      onPanResponderTerminate: () => {
        draggingIndex.current = null;
        setActiveIndex(null);
      },
    });

  const renderItemWrapper = ({ item, index }: { item: T; index: number }) => {
    const isDragging = activeIndex === index;
    const panResponder = createPanResponder(index);

    return (
      <View
        style={[styles.itemContainer, isDragging && { opacity: 0 }]}
        {...panResponder.panHandlers}
      >
        {renderItem(item, index, isDragging)}
      </View>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => (listTop.current = e.nativeEvent.layout.y)}
    >
      {/* Title on top */}
      <Text style={styles.title}>Optimized Meeting Order</Text>

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItemWrapper}
        scrollEnabled={false}
      />

      {/* Floating item */}
      {activeIndex !== null && (
        <Animated.View
          style={[
            styles.floatingItem,
            { top: dragY, position: "absolute", width: "100%", zIndex: 999 },
          ]}
        >
          {renderItem(data[activeIndex], activeIndex, true)}
        </Animated.View>
      )}
    </View>
  );
};

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
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 8,
  },
  floatingItem: {
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
  },
});
