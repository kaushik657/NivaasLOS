// src/services/location/LocationHelper.tsx
import { PermissionsAndroid, Platform, Linking, Alert } from "react-native";
import Geolocation, { GeoPosition } from "react-native-geolocation-service";
import axios from "axios";
import Geocoder from "react-native-geocoding";

// Use environment variable for production
const GOOGLE_MAPS_API_KEY = "AIzaSyC1-MUz0bX_Bp_CXU97mm4Nmyf-Hj95rYw";
Geocoder.init(GOOGLE_MAPS_API_KEY);

// ---------------------- Permissions ----------------------
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs your location to optimize routes.",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        }
      );

      const coarse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );

      return (
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.error("Permission error:", err);
      return false;
    }
  }
  // iOS automatically prompts user
  return true;
};

// ---------------------- Get Current Location ----------------------
export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> =>
  new Promise((resolve, reject) => {
    if (!Geolocation)
      return reject(new Error("Geolocation module not available"));

    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);
        Alert.alert(
          "Location Error",
          "Unable to get current location. Make sure GPS is enabled."
        );
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
    );
  });

// ---------------------- Reverse Geocoding ----------------------
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const response = await Geocoder.from(latitude, longitude);
    return response.results[0]?.formatted_address || null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

// ---------------------- Distance Calculation ----------------------
export const getDistancesFromUser = async (
  userLocation: { latitude: number; longitude: number },
  leads: { latitude: number; longitude: number; id: number }[]
) => {
  try {
    const origins = `${userLocation.latitude},${userLocation.longitude}`;
    const destinations = leads
      .map((l) => `${l.latitude},${l.longitude}`)
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origins}&destinations=${destinations}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
    console.log("urlll", url);

    const response = await axios.get(url);

    if (response.data.status !== "OK") throw new Error(response.data.status);

    const elements = response.data.rows[0].elements;

    return leads
      .map((lead, i) => ({
        ...lead,
        distance: elements[i]?.distance?.value ?? 0,
        duration: elements[i]?.duration?.value ?? 0,
        distanceText: elements[i]?.distance?.text ?? "",
        durationText: elements[i]?.duration?.text ?? "",
      }))
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error("Distance fetch error:", error);
    throw error;
  }
};

// ---------------------- Open Google Maps ----------------------
export const openGoogleMapsNavigation = (
  userLocation: { latitude: number; longitude: number },
  sortedLeads: { latitude: number; longitude: number }[]
) => {
  if (!sortedLeads.length) return;

  const waypoints =
    sortedLeads.length > 1
      ? sortedLeads
          .slice(0, -1)
          .map((l) => `${l.latitude},${l.longitude}`)
          .join("|")
      : "";

  const destination = sortedLeads[sortedLeads.length - 1];
  const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${destination.latitude},${destination.longitude}&waypoints=${waypoints}&travelmode=driving`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert("Error", "Cannot open Google Maps.");
    })
    .catch((err) => console.error("Google Maps navigation error:", err));
};

// export const openGoogleMapsWithMarkers = async (
//   userLocation: { latitude: number; longitude: number },
//   locations: { latitude: number; longitude: number; name: string }[]
// ) => {
//   try {
//     // User location marker (default blue)
//     const userMarker = `&markers=color:blue|label:U|${userLocation.latitude},${userLocation.longitude}`;

//     // Meeting locations markers (red)
//     const locationMarkers = locations
//       .map(
//         (loc, index) =>
//           `&markers=color:red|label:${index + 1}|${loc.latitude},${
//             loc.longitude
//           }`
//       )
//       .join("");

//     // Static Google Maps URL
//     const url = `https://www.google.com/maps/search/?api=1${userMarker}${locationMarkers}`;

//     const supported = await Linking.canOpenURL(url);
//     if (supported) {
//       Linking.openURL(url);
//     } else {
//       Alert.alert("Error", "Cannot open Google Maps");
//     }
//   } catch (error) {
//     console.error("Google Maps error:", error);
//     Alert.alert("Error", "Something went wrong while opening maps");
//   }
// };

export const openGoogleMapsWithMarkers = async (
  userLocation: { latitude: number; longitude: number },
  meetings: { latitude: number; longitude: number; name?: string }[]
) => {
  try {
    if (!meetings.length) return;

    const baseUrl = "https://www.google.com/maps/dir/?api=1";

    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${meetings[meetings.length - 1].latitude},${
      meetings[meetings.length - 1].longitude
    }`;

    const waypoints =
      meetings.length > 1
        ? meetings
            .slice(0, meetings.length - 1) // all except last
            .map((m) => `${m.latitude},${m.longitude}`)
            .join("|")
        : "";

    const url = `${baseUrl}&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ""
    }&travelmode=driving`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "Cannot open Google Maps.");
    }
  } catch (error) {
    console.error("Google Maps navigation error:", error);
    Alert.alert("Error", "Something went wrong while opening Google Maps.");
  }
};
