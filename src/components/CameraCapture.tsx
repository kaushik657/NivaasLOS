import React, { useRef, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constants/colors";
import CurrentAddress from "./CurrentAddress";

interface CameraCaptureProps {
  onCapture: (photoPath: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
}) => {
  const device = useCameraDevice("back");
  const cameraRef = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturePressed, setCapturePressed] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePhoto({ flash: "off" });
      onCapture(`file://${photo.path}`);
    } catch (error) {
      console.log("Capture error:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!device || !hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Camera not available or permission denied</Text>
        <TouchableOpacity onPress={onClose} style={styles.cancelButtonOutline}>
          <Text style={styles.cancelButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.bottomControls}>
        {capturePressed ? <CurrentAddress /> : null}
        {/* Capture Button */}
        {!capturePressed ? (
          <TouchableOpacity
            onPress={() => setCapturePressed(true)}
            style={[styles.captureButton, isCapturing && { opacity: 0.6 }]}
            disabled={isCapturing}
          >
            <Text style={styles.captureButtonText}>Capture</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={takePhoto}
            style={[styles.captureButton, isCapturing && { opacity: 0.6 }]}
            disabled={isCapturing}
          >
            <Text style={styles.captureButtonText}>Save</Text>
          </TouchableOpacity>
        )}
        {/* Cancel Button */}
        <TouchableOpacity onPress={onClose} style={styles.cancelButtonOutline}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraCapture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------- Bottom Controls ---------- */
  bottomControls: {
    position: "absolute",
    bottom: verticalScale(30),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(10),
    gap: verticalScale(12),
  },

  /* ---------- Capture Button ---------- */
  captureButton: {
    backgroundColor: Colors.PRIMARY, // Blue
    width: "100%",
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonText: {
    color: Colors.WHITE,
    fontSize: moderateScale(14),
    fontWeight: "600",
  },

  /* ---------- Cancel Button (Outlined) ---------- */
  cancelButtonOutline: {
    backgroundColor: Colors.WHITE,
    width: "100%",
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1.5),
    borderColor: Colors.PRIMARY,
  },
  cancelButtonText: {
    color: Colors.PRIMARY,
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});
