import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";
import { DraggableFlatList } from "../components/DraggableFlatlist";
import {
  requestLocationPermission,
  getCurrentLocation,
  openGoogleMapsWithMarkers,
} from "../services/location/LocationHelper";

const initialData = [
  {
    id: 1,
    name: "Neha Verma",
    type: "Followup",
    time: "2:45 PM",
    latitude: 28.6139,
    longitude: 77.209,
  },
  {
    id: 2,
    name: "Premier Industries Corp",
    type: "Followup",
    time: "9:00 AM",
    latitude: 28.4595,
    longitude: 77.0266,
  },
  {
    id: 3,
    name: "Sanjay Sharma",
    type: "Meeting",
    time: "4:45 PM",
    latitude: 28.4089,
    longitude: 77.3178,
  },
  {
    id: 4,
    name: "Premier Industries Pvt Ltd",
    type: "Call",
    time: "9:30 AM",
    latitude: 28.9845,
    longitude: 77.7064,
  },
];

const ITEM_HEIGHT = 70;
const { width } = Dimensions.get("window");

export default function RoutePlanScreen() {
  const [meetings, setMeetings] = useState(initialData);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    })();
  }, []);

  const handleStartNavigation = async () => {
    if (!currentLocation) return;
    openGoogleMapsWithMarkers(currentLocation, meetings);
  };

  // Calculate center and delta to fit all markers
  const allPoints = currentLocation
    ? [
        ...meetings,
        {
          id: 0,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      ]
    : meetings;

  const latitudes = allPoints.map((p) => p.latitude);
  const longitudes = allPoints.map((p) => p.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  const mapRegion = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: (maxLat - minLat) * 1.5 || 0.05,
    longitudeDelta: (maxLon - minLon) * 1.5 || 0.05,
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Optimized Route Plan</Text>

        {/* Map Preview */}
        <View style={styles.mapWrapper}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {currentLocation && (
                <Marker
                  coordinate={currentLocation}
                  title="You are here"
                  pinColor="blue"
                />
              )}
              {meetings.map((meeting) => (
                <Marker
                  key={meeting.id}
                  coordinate={{
                    latitude: meeting.latitude,
                    longitude: meeting.longitude,
                  }}
                  title={meeting.name}
                  description={`${meeting.type} • ${meeting.time}`}
                />
              ))}
            </MapView>
          </View>
        </View>

        {/* Draggable list */}
        <DraggableFlatList
          data={meetings}
          itemHeight={ITEM_HEIGHT}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item, index, isDragging) => (
            <View
              style={[styles.meetingItem, isDragging && styles.draggingItem]}
            >
              <Text style={styles.meetingName}>{item.name}</Text>
              <Text style={styles.meetingDetails}>
                {item.type} • {item.time}
              </Text>
            </View>
          )}
          onDragEnd={(newData) => setMeetings(newData)}
        />

        <View style={styles.buttonWrapper}>
          <Text style={styles.startButton} onPress={handleStartNavigation}>
            Optimized Route Path
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  mapWrapper: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
  },
  mapContainer: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  meetingItem: {
    height: ITEM_HEIGHT,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginVertical: 4,
  },
  draggingItem: { backgroundColor: "#dbeafe" },
  meetingName: { fontSize: 16, fontWeight: "500" },
  meetingDetails: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  buttonWrapper: { marginTop: 20 },
  startButton: {
    backgroundColor: "#2563EB",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
