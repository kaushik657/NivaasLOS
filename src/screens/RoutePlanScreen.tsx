import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
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

export default function RoutePlanScreen() {
  const [meetings, setMeetings] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleStartNavigation = async () => {
    try {
      setLoading(true);
      const granted = await requestLocationPermission();
      if (!granted) {
        alert("Location permission denied.");
        return;
      }
      const userLocation = await getCurrentLocation();
      openGoogleMapsWithMarkers(userLocation, meetings);
    } catch (err) {
      console.error(err);
      alert("Unable to open map. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Optimized Route Plan</Text>

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
          <Text
            style={[styles.startButton, loading && styles.disabledButton]}
            onPress={handleStartNavigation}
          >
            {loading ? "Loading..." : "Optimized Route Path"}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
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
  disabledButton: { opacity: 0.6 },
});
