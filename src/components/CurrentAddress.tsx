import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import Geocoder from "react-native-geocoding";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";


Geocoder.init("AIzaSyC1-MUz0bX_Bp_CXU97mm4Nmyf-Hj95rYw");

interface Props {
  showCoords?: boolean;
  refreshable?: boolean;
}

const CurrentAddress: React.FC<Props> = ({
  showCoords = true,
  refreshable = true,
}) => {
  const [address, setAddress] = useState<string>("Fetching address...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const requestPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS asks automatically
  };

  const fetchAddress = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      setAddress("Permission denied");
      return;
    }

    setLoading(true);

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;
          const res = await fetch(url, {
            headers: {
              'User-Agent': 'ShubhamLos/1.0 (vipinkkt@yahoo.in)',
            },
          });

          if (!res.ok) throw new Error('Failed to fetch address');
          const data = await res.json();
          console.log('Reverse Geocode Data:', data);
          setAddress(data.display_name || 'Unknown address');
        } catch (err: any) {
          Alert.alert('Error', err.message);
        }
        finally {
          setLoading(false);
        }

        
      },
      (error) => {
        console.log("Location error:", error);
        setAddress("Error fetching location");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <View style={styles.card}>
          {/* Left: Static Map Image */}
          <Image
            source={require("../assets/static-map.png")} // Place your static map image in /assets
            style={styles.mapImage}
          />

          {/* Right: Location Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.email}>akshay@gmail.com</Text>
            <Text style={styles.address} numberOfLines={2}>
              {address}
            </Text>

            {showCoords && coords && (
              <Text style={styles.coords}>
                Lat: {coords.lat.toFixed(5)}, Long: {coords.lng.toFixed(5)}
              </Text>
            )}

            <Text style={styles.timestamp}>
              {new Date().toLocaleDateString()}{" "}
              {new Date().toLocaleTimeString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CurrentAddress;

const styles = StyleSheet.create({
  container: {
    // padding: scale(5),
    alignItems: "center",
    backgroundColor: "transparent",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.6)", // Semi-transparent black
    borderRadius: moderateScale(8),
    overflow: "hidden",
    width: "100%",
    padding: scale(12),
  },
  mapImage: {
    width: scale(80),
    height: verticalScale(80),
    borderRadius: moderateScale(12),
    marginRight: scale(12),
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  email: {
    fontSize: moderateScale(12),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: verticalScale(4),
  },
  address: {
    fontSize: moderateScale(12),
    color: "#fff",
    marginBottom: verticalScale(8),
  },
  coords: {
    fontSize: moderateScale(12),
    color: "#ccc",
    marginBottom: verticalScale(8),
  },
  timestamp: {
    fontSize: moderateScale(12),
    color: "#ccc",
    marginBottom: verticalScale(8),
  },
  button: {
    marginTop: verticalScale(8),
    backgroundColor: "#007BFF",
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
});
