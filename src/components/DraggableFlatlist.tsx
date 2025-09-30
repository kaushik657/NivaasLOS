import React, { useState } from "react";
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
  const [listData, setListData] = useState(data);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragY = React.useRef(0);

  const createPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setDraggingIndex(index),
      onPanResponderMove: (_, gestureState) => {
        dragY.current = gestureState.dy;

        const newIndex = Math.min(
          listData.length - 1,
          Math.max(
            0,
            Math.floor((index * itemHeight + gestureState.dy) / itemHeight)
          )
        );

        if (newIndex !== index) {
          const updated = [...listData];
          const [removed] = updated.splice(index, 1);
          updated.splice(newIndex, 0, removed);
          setListData(updated);
          setDraggingIndex(newIndex);
        }
      },
      onPanResponderRelease: () => {
        setDraggingIndex(null);
        onDragEnd && onDragEnd(listData);
      },
      onPanResponderTerminate: () => {
        setDraggingIndex(null);
        onDragEnd && onDragEnd(listData);
      },
    });

  const renderDraggableItem = ({ item, index }: { item: T; index: number }) => {
    const isDragging = draggingIndex === index;
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
      data={listData}
      keyExtractor={keyExtractor}
      renderItem={renderDraggableItem}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  draggingItem: { backgroundColor: "#dbeafe" },
});
