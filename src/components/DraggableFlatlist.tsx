import React, { useRef, useState } from "react";
import {
  FlatList,
  View,
  PanResponder,
  StyleSheet,
  LayoutRectangle,
} from "react-native";

interface DraggableFlatListProps<T> {
  data: T[];
  renderItem: (
    item: T,
    index: number,
    isDragging: boolean
  ) => React.ReactElement;
  keyExtractor: (item: T) => string;
  itemHeight: number;
  onDragEnd?: (data: T[]) => void;
}

export const DraggableFlatList = <T,>({
  data,
  renderItem,
  keyExtractor,
  itemHeight,
  onDragEnd,
}: DraggableFlatListProps<T>) => {
  const draggingIndex = useRef<number | null>(null);
  const listTop = useRef<number>(0); // absolute y-position of FlatList
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // NEW

  const createPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        draggingIndex.current = index;
        setActiveIndex(index); // highlight immediately
      },
      onPanResponderMove: (_, gestureState) => {
        if (draggingIndex.current === null) return;

        const absoluteY = gestureState.moveY - listTop.current;
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
          setActiveIndex(toIndex); // update highlight while dragging
          onDragEnd && onDragEnd(updated);
        }
      },
      onPanResponderRelease: () => {
        draggingIndex.current = null;
        setActiveIndex(null); // remove highlight
      },
      onPanResponderTerminate: () => {
        draggingIndex.current = null;
        setActiveIndex(null); // remove highlight
      },
    });

  const renderDraggableItem = ({ item, index }: { item: T; index: number }) => {
    const isDragging = activeIndex === index;
    const panResponder = createPanResponder(index);

    return (
      <View
        style={[
          styles.itemContainer, // just change border color
        ]}
        {...panResponder.panHandlers}
      >
        {renderItem(item, index, isDragging)}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderDraggableItem}
      scrollEnabled={false}
      onLayout={(e) => {
        const layout: LayoutRectangle = e.nativeEvent.layout;
        listTop.current = layout.y;
      }}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderWidth: 2,
    borderColor: "transparent", // always reserve border space
    borderRadius: 8,
  },
});
