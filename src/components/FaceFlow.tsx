// src/FaceLivenessFlow.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Button,
  View,
  useWindowDimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  useCameraDevice,
  useCameraPermission,
  Camera as RnCamera,
} from "react-native-vision-camera";
import { useAppState } from "@react-native-community/hooks";
import {
  Camera as DetectorCamera,
  Face,
  FaceDetectionOptions,
} from "react-native-vision-camera-face-detector";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { ScreenNames } from "../navigation/AppNavigator";
interface Props{
  navigation:any
}
type LivenessAction = "center" | "turnLeft" | "turnRight";

export default function FaceLivenessFlow(props:Props): JSX.Element {
  const { width, height } = useWindowDimensions();
  const { hasPermission, requestPermission } = useCameraPermission();
  const appState = useAppState();

  const [cameraMounted, setCameraMounted] = useState(false);
  const [cameraPaused, setCameraPaused] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"front" | "back">("front");
  const [success, setSuccess] = useState(false);

  const challenges: LivenessAction[] = ["center", "turnLeft", "turnRight"];
  const [passedSteps, setPassedSteps] = useState<boolean[]>(
    challenges.map(() => false)
  );
  const [capturedPhotos, setCapturedPhotos] = useState<
    { step: LivenessAction; uri: string }[]
  >([]);
  const [showGallery, setShowGallery] = useState(false);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: "fast",
    classificationMode: "all",
    contourMode: "all",
    landmarkMode: "all",
    windowWidth: width,
    windowHeight: height,
  }).current;

  const isCameraActive = !cameraPaused && appState === "active";
  const cameraDevice = useCameraDevice(cameraFacing);
  const cameraRef = useRef<RnCamera | null>(null);

  // --- Overlay circle (fixed center) ---
  const borderColor = useSharedValue(0); // 0 = red, 1 = green
  const scale = useSharedValue(1);
  const TARGET_RADIUS = Math.min(width, height) * 0.35;
  const centerX = width / 2;
  const centerY = height / 2;

  const overlayCircleStyle = useAnimatedStyle(() => {
    const color = interpolateColor(borderColor.value, [0, 1], ["red", "green"]);
    return {
      position: "absolute",
      width: TARGET_RADIUS * 2,
      height: TARGET_RADIUS * 2,
      borderRadius: TARGET_RADIUS,
      borderWidth: 5,
      borderColor: color,
      left: centerX - TARGET_RADIUS,
      top: centerY - TARGET_RADIUS,
      transform: [{ scale: scale.value }],
    };
  });

  // Timer ref for delayed capture
  const captureTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // ---------- Helpers ----------
  function isFaceInsideCircle(face: Face): boolean {
    const { x, y, width: fw, height: fh } = face.bounds;
    const fcX = x + fw / 2;
    const fcY = y + fh / 2;
    const distance = Math.sqrt(
      Math.pow(fcX - centerX, 2) + Math.pow(fcY - centerY, 2)
    );
    const faceRadius = Math.max(fw, fh) / 2;
    return distance + faceRadius < TARGET_RADIUS * 0.9;
  }

  function detectHeadTurn(face: Face, dir: "left" | "right"): boolean {
    const rotY = (face as any).yawAngle ?? (face as any).headEulerAngleY ?? 0;
    const LEFT_THRESHOLD = -12;
    const RIGHT_THRESHOLD = 12;
    if (dir === "left") return rotY < LEFT_THRESHOLD;
    if (dir === "right") return rotY > RIGHT_THRESHOLD;
    return false;
  }

  async function capturePhotoForStep(step: LivenessAction) {
    if (!cameraRef.current || typeof (cameraRef.current as any).takePhoto !== "function") return;
    try {
      const photo = await (cameraRef.current as any).takePhoto({ skipMetadata: true });
      const uri = photo?.path ? `file://${photo.path}` : photo?.uri ?? null;
      if (uri) {
        setCapturedPhotos((p) => [...p, { step, uri }]);
      }
    } catch (err) {
      console.warn("Photo capture failed:", err);
    }
  }

  // ---------- Main face handler ----------
  function handleFacesDetected(faces: Face[]) {
    if (!faces || faces.length === 0) {
      borderColor.value = withTiming(0);
      if (captureTimer.current) {
        clearTimeout(captureTimer.current);
        captureTimer.current = null;
      }
      return;
    }

    const face = faces[0];
    const newPassed = [...passedSteps];

    // Which challenge is next?
    const nextIdx = newPassed.findIndex((v) => !v);
    const currentChallenge = challenges[nextIdx];

    let passed = false;
    if (isFaceInsideCircle(face)) {
      switch (currentChallenge) {
        case "center":
          passed = true;
          break;
        case "turnLeft":
          passed = detectHeadTurn(face, "left");
          break;
        case "turnRight":
          passed = detectHeadTurn(face, "right");
          break;
      }
    }

    if (passed) {
      borderColor.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 4, stiffness: 120 }),
        withSpring(1)
      );

      if (!captureTimer.current) {
        captureTimer.current = setTimeout(() => {
          newPassed[nextIdx] = true;
          setPassedSteps(newPassed);
          capturePhotoForStep(currentChallenge);

          if (newPassed.every(Boolean)) {
           
            setSuccess(true);
            setShowGallery(true);
           setTimeout(()=>{
            props.navigation.navigate(ScreenNames.LIVELINESS_RESULT)
           },500)
          }
          captureTimer.current = null;
        }, 1500);
      }
    } else {
      borderColor.value = withTiming(0, { duration: 200 });
      if (captureTimer.current) {
        clearTimeout(captureTimer.current);
        captureTimer.current = null;
      }
    }
  }

  // ---------- UI ----------
  if (!cameraDevice) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>No camera device available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        {hasPermission ? (
          cameraMounted ? (
            <>
              <DetectorCamera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                isActive={isCameraActive}
                device={cameraDevice}
                faceDetectionCallback={handleFacesDetected}
                faceDetectionOptions={{ ...faceDetectionOptions, autoMode: true, cameraFacing }}
                photo={true}
              />

              {/* Fixed Circular Overlay */}
              <Animated.View pointerEvents="none" style={overlayCircleStyle} />

              <View style={styles.instructionWrap}>
                <Text style={styles.instructionText}>
                  {success
                    ? "✅ Liveness Passed!"
                    : `Steps: ${passedSteps.filter(Boolean).length}/${challenges.length} — Next: ${challenges[passedSteps.findIndex((v) => !v) ?? 0]}`}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.centerNotice}>
              <Text>Camera is not mounted. Tap below to mount.</Text>
            </View>
          )
        ) : (
          <View style={styles.center}>
            <Text style={styles.info}>
              No camera permission. Please grant camera permission.
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Button
          onPress={() => setCameraFacing((c) => (c === "front" ? "back" : "front"))}
          title="Toggle Camera"
        />
        <Button
          onPress={() => setCameraPaused((c) => !c)}
          title={cameraPaused ? "Resume" : "Pause"}
        />
        <Button
          onPress={() => setCameraMounted((m) => !m)}
          title={cameraMounted ? "Unmount" : "Mount"}
        />
        <Button
          onPress={() => {
            setPassedSteps(challenges.map(() => false));
            setCapturedPhotos([]);
            setSuccess(false);
            setShowGallery(false);
          }}
          title="Reset"
        />
      </View>

      {/* Gallery */}
      {showGallery && capturedPhotos.length > 0 && (
        <View style={styles.gallery}>
          <Text style={{ color: "white", marginBottom: 8 }}>
            Captured Photos
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {capturedPhotos.map((p, i) => (
              <View key={i} style={styles.thumbWrap}>
                <Image source={{ uri: p.uri }} style={styles.thumb} />
                <Text style={{ color: "white", textAlign: "center" }}>
                  {p.step}
                </Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeGallery}
            onPress={() => setShowGallery(false)}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  info: { color: "#fff" },
  centerNotice: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionWrap: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 6,
  },
  controls: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  gallery: {
    position: "absolute",
    top: 80,
    left: 10,
    right: 10,
    height: 220,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: 8,
  },
  thumbWrap: { marginRight: 10, alignItems: "center" },
  thumb: {
    width: 140,
    height: 180,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fff",
  },
  closeGallery: {
    marginTop: 8,
    alignSelf: "center",
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 6,
  },
});
