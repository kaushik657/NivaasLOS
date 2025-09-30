import React, { useRef } from "react";
import { FlatList, View, PanResponder, StyleSheet } from "react-native";

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

  const createPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        draggingIndex.current = index;
      },
      onPanResponderMove: (_, gestureState) => {
        if (draggingIndex.current === null) return;

        const fromIndex = draggingIndex.current;
        const toIndex = Math.min(
          data.length - 1,
          Math.max(
            0,
            Math.floor((fromIndex * itemHeight + gestureState.dy) / itemHeight)
          )
        );

        if (fromIndex !== toIndex) {
          const updated = [...data];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          draggingIndex.current = toIndex;
          onDragEnd && onDragEnd(updated); // continuously update parent
        }
      },
      onPanResponderRelease: () => {
        draggingIndex.current = null;
      },
      onPanResponderTerminate: () => {
        draggingIndex.current = null;
      },
    });

  const renderDraggableItem = ({ item, index }: { item: T; index: number }) => {
    const isDragging = draggingIndex.current === index;
    const panResponder = createPanResponder(index);

    return (
      <View
        style={isDragging ? styles.draggingItem : undefined}
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
    />
  );
};

const styles = StyleSheet.create({
  draggingItem: { backgroundColor: "#dbeafe" },
});
