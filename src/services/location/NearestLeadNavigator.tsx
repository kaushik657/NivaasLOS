import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline, LatLng } from "react-native-maps";
import {
  requestLocationPermission,
  getCurrentLocation,
} from "./LocationHelper";

type Lead = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
};

const leads: Lead[] = [
  { id: "1", name: "Lead A", lat: 28.6139, lng: 77.209 },
  { id: "2", name: "Lead B", lat: 28.7041, lng: 77.1025 },
  { id: "3", name: "Lead C", lat: 28.5355, lng: 77.391 },
];

export default function NearestLeadNavigator() {
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [nearestLead, setNearestLead] = useState<Lead | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;
      const location = await getCurrentLocation();
      setCurrentLocation(location);

      // Find nearest lead
      const closest = findNearestLead(location, leads);
      setNearestLead(closest);
    })();
  }, []);

  const handleOpenExternalNavigation = () => {
    if (!nearestLead) return;
    const url = Platform.select({
      ios: `maps://app?daddr=${nearestLead.lat},${nearestLead.lng}`,
      android: `google.navigation:q=${nearestLead.lat},${nearestLead.lng}`,
    });
    Linking.openURL(url!);
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={currentLocation} title="FOS Location" />
          {nearestLead && (
            <Marker
              coordinate={{
                latitude: nearestLead.lat,
                longitude: nearestLead.lng,
              }}
              title={nearestLead.name}
            />
          )}
        </MapView>
      )}
      <View style={styles.bottomPanel}>
        {nearestLead ? (
          <>
            <Text style={styles.title}>Nearest Lead: {nearestLead.name}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleOpenExternalNavigation}
            >
              <Text style={styles.buttonText}>Navigate</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Finding nearest lead...</Text>
        )}
      </View>
    </View>
  );
}

/** Haversine formula to find nearest lead */
function haversineDistance(coord1: LatLng, coord2: LatLng): number {
  const R = 6371e3; // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
}

function findNearestLead(current: LatLng, leads: Lead[]): Lead {
  let minDistance = Infinity;
  let nearest = leads[0];
  for (const lead of leads) {
    const distance = haversineDistance(current, {
      latitude: lead.lat,
      longitude: lead.lng,
    });
    if (distance < minDistance) {
      minDistance = distance;
      nearest = lead;
    }
  }
  return nearest;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  bottomPanel: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  button: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "600" },
});
