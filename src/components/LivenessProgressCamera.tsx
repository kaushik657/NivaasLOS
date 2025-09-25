import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import {
  useCameraDevice,
  Camera as VisionCamera,
} from "react-native-vision-camera";
import {
  Camera as DetectorCamera,
  Face,
} from "react-native-vision-camera-face-detector";

type LivenessStep = "center" | "turnRight" | "turnLeft";

const { width, height } = Dimensions.get("window");
const BOX_SIZE = 250;

interface FaceScannerProps {
  steps: LivenessStep[];
  onComplete: (photos: { step: LivenessStep; photoPath: string }[]) => void;
  showBox?: boolean;
}

export default function FaceScanner({
  steps,
  onComplete,
  showBox = true,
}: FaceScannerProps) {
  const device = useCameraDevice("front");
  const cameraRef = useRef<VisionCamera>(null);

  const [currentStep, setCurrentStep] = useState<LivenessStep>(steps[0]);
  const [passedSteps, setPassedSteps] = useState<
    { step: LivenessStep; photoPath: string }[]
  >([]);
  const [holding, setHolding] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [boxColor, setBoxColor] = useState("white");
  const holdColorRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      setIsActive(false);
      cameraRef.current = null;
      if (holdColorRef.current) clearTimeout(holdColorRef.current);
    };
  }, []);

  const isFaceCentered = (face: Face) => {
    const { x, y, width: w, height: h } = face.bounds;
    const cx = width - (x + w / 2); // mirror
    const cy = y + h / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const TOL = 80;
    return Math.abs(cx - centerX) < TOL && Math.abs(cy - centerY) < TOL;
  };

  const detectHeadTurn = (face: Face, dir: "left" | "right") => {
    const rotY = (face as any).yawAngle ?? (face as any).headEulerAngleY ?? 0;
    if (dir === "left") return rotY < -12;
    if (dir === "right") return rotY > 12;
    return false;
  };

  const handleFaces = async (faces: Face[]) => {
    if (faces.length === 0 || holding) return;
    const face = faces[0];

    // Check the current step
    let passed = false;
    switch (currentStep) {
      case "center":
        passed = isFaceCentered(face);
        break;
      case "turnRight":
        passed = detectHeadTurn(face, "right");
        break;
      case "turnLeft":
        passed = detectHeadTurn(face, "left");
        break;
    }

    // Update box color
    setBoxColor(passed ? "green" : "white");

    if (holdColorRef.current) clearTimeout(holdColorRef.current);
    holdColorRef.current = setTimeout(() => setBoxColor("white"), 1500);

    if (!passed) return;

    setHolding(true);

    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({ flash: "off" });

        const updatedSteps: { step: LivenessStep; photoPath: string }[] = [
          ...passedSteps,
          { step: currentStep, photoPath: photo.path },
        ];

        setPassedSteps(updatedSteps);

        setTimeout(() => {
          const nextIdx = steps.findIndex((s) => s === currentStep) + 1;
          if (nextIdx < steps.length) setCurrentStep(steps[nextIdx]);
          else {
            setIsActive(false);
            onComplete(updatedSteps);
          }
          setHolding(false);
        }, 1200);
      }
    } catch (err) {
      console.error("Photo capture error:", err);
      setHolding(false);
    }
  };

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>No Camera Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Instructions at top */}
      <View style={styles.top}>
        <Text style={styles.instructionText}>
          {currentStep === "center"
            ? "Center Your Face"
            : currentStep === "turnRight"
            ? "Move Right"
            : "Move Left"}
        </Text>
      </View>

      {/* Camera in center */}
      <View style={styles.cameraContainer}>
        <DetectorCamera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          faceDetectionCallback={handleFaces}
          photo
          faceDetectionOptions={{
            performanceMode: "fast",
            classificationMode: "all",
          }}
        />
        {showBox && (
          <View style={[styles.faceBox]}>
            {/* Top Left */}
            <View
              style={[styles.corner, styles.topLeft, { borderColor: boxColor }]}
            />
            {/* Top Right */}
            <View
              style={[
                styles.corner,
                styles.topRight,
                { borderColor: boxColor },
              ]}
            />
            {/* Bottom Left */}
            <View
              style={[
                styles.corner,
                styles.bottomLeft,
                { borderColor: boxColor },
              ]}
            />
            {/* Bottom Right */}
            <View
              style={[
                styles.corner,
                styles.bottomRight,
                { borderColor: boxColor },
              ]}
            />
          </View>
        )}
      </View>

      {/* Status at bottom */}
      <View style={styles.bottom}>
        <Text style={styles.statusText}>
          {holding
            ? "Scanned 🟢"
            : boxColor === "green"
            ? "Good ✅"
            : "Scanning..."}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          top: 20,
          left: 15,
          width: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "red",
            width: 15,
            height: 15,
            borderRadius: 50,
          }}
        />
        <Text style={{ color: "white", paddingTop: 5 }}>REC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  top: {
    height: moderateScale(80),
    justifyContent: "center",
    alignItems: "center",
    paddingTop: moderateScale(20),
  },

  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: width, // Keeps the camera area square
  },

  bottom: {
    height: moderateScale(80),
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: moderateScale(20),
  },

  instructionText: {
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    fontSize: moderateScale(20),
    fontWeight: "600",
  },

  statusText: {
    fontFamily: "Montserrat-Regular",
    color: "#ccc",
    fontSize: moderateScale(18),
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /** Face Detection Box **/
  faceBox: {
    width: scale(250), // Direct scaling for face box
    height: scale(250),
    position: "absolute",
  },

  corner: {
    width: scale(30), // Direct scaling for corner length
    height: scale(30),
    borderWidth: moderateScale(3), // Direct scaling for border thickness
    position: "absolute",
  },

  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: moderateScale(4),
  },

  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: moderateScale(4),
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: moderateScale(4),
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: moderateScale(4),
  },
});
