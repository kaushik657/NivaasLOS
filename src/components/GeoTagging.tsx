import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid } from "react-native";
import { Colors } from "../constants/colors";

type RootStackParamList = {
  CameraCapture: { index: number };
};

type GeoTaggingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CameraCapture"
>;

interface GeoTaggingProps {
  capturedImage?: string;
  index?: number;
}

const GeoTagging: React.FC<GeoTaggingProps> = ({ capturedImage, index }) => {
  const [images, setImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [address, setAddress] = useState<string | null>(null);
  const navigation = useNavigation<GeoTaggingNavigationProp>();

  // Update only the selected slot when a new image comes in
  useEffect(() => {
    if (capturedImage && index !== undefined) {
      setImages((prev) => {
        const updated = [...prev];
        updated[index] = `file://${capturedImage}`;
        return updated;
      });
    }
  }, [capturedImage, index]);

  // Request location permission on Android
  const requestPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs access to your location",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Get location + reverse geocode with OpenStreetMap
  const fetchAddress = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert("Permission denied", "Location permission is required.");
      return;
    }

    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;
          const res = await fetch(url, {
            headers: {
              "User-Agent": "ShubhamLos/1.0 (vipinkkt@yahoo.in)",
            },
          });

          if (!res.ok) throw new Error("Failed to fetch address");
          const data = await res.json();
          console.log("Reverse Geocode Data:", data);
          setAddress(data.display_name || "Unknown address");
        } catch (err: any) {
          Alert.alert("Error", err.message);
        }
      },
      (err) => {
        Alert.alert("Error", err.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleAddPhoto = (idx: number) => {
    navigation.navigate("CameraCapture", { index: idx });
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<string | null>) => (
    <TouchableOpacity
      style={styles.imageBox}
      onPress={() => handleAddPhoto(index)}
    >
      {item ? (
        <Image source={{ uri: item }} style={styles.image} />
      ) : (
        <View style={styles.plusContainer}>
          <Image source={require("../assets/plus.png")} />
          <Text style={styles.plusContainerText}>Add more</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      />

      {address && (
        <Text
          style={{ marginVertical: 10, fontSize: 14, color: Colors.PRIMARY }}
        >
          📍 {address}
        </Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={fetchAddress}>
        <Text style={styles.submitText}>Get Current Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GeoTagging;

/* ---------- ORIGINAL STYLES (UNCHANGED) ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(10),
  },
  imageBox: {
    width: "48%",
    height: verticalScale(170),
    backgroundColor: Colors.BACKGROUND_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
  },
  plusContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(20),
  },
  plusContainerText: {
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(14),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(8),
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  submitText: {
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(14),
    color: Colors.WHITE,
  },
});
