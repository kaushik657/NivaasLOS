import React from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../constants/colors";

interface LoaderProps {
  visible: boolean;
  transparent?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ visible, transparent = true }) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
});
