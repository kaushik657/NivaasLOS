import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  requestLocationPermission,
  getCurrentLocation,
  getDistancesFromUser,
  openGoogleMapsNavigation,
  openGoogleMapsWithMarkers,
} from "../services/location/LocationHelper";

const routeData = {
  meetings: [
    {
      id: 1,
      name: "Neha Verma",
      type: "Followup",
      time: "2:45 PM",
      latitude: 28.6139,
      longitude: 77.209, // Delhi
    },
    {
      id: 2,
      name: "Premier Industries Corp",
      type: "Followup",
      time: "9:00 AM",
      latitude: 28.4595,
      longitude: 77.0266, // Gurgaon
    },
    {
      id: 3,
      name: "Sanjay Sharma",
      type: "Meeting",
      time: "4:45 PM",
      latitude: 28.4089,
      longitude: 77.3178, // Faridabad
    },
    {
      id: 4,
      name: "Premier Industries Pvt Ltd",
      type: "Call",
      time: "9:30 AM",
      latitude: 28.9845,
      longitude: 77.7064, // Meerut
    },
  ],
};

const RoutePlanScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  // const handleStartNavigation = async () => {
  //   try {
  //     setLoading(true);

  //     // 1. Request permission
  //     const granted = await requestLocationPermission();
  //     if (!granted) {
  //       alert("Location permission denied.");
  //       return;
  //     }

  //     // 2. Get current user location
  //     const userLocation = await getCurrentLocation();

  //     // 3. Skip distance calculation, just open Google Maps
  //     openGoogleMapsWithMarkers(userLocation, routeData.meetings);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Unable to open maps. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleStartNavigation = async () => {
    try {
      setLoading(true);

      const granted = await requestLocationPermission();
      if (!granted) {
        alert("Location permission denied.");
        return;
      }

      const userLocation = await getCurrentLocation();

      openGoogleMapsWithMarkers(userLocation, routeData.meetings);
    } catch (error) {
      console.error(error);
      alert("Unable to open map. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Optimized Route Plan</Text>

        <FlatList
          data={routeData.meetings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.meetingItem}>
              <Text style={styles.meetingName}>{item.name}</Text>
              <Text style={styles.meetingDetails}>
                {item.type} • {item.time}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartNavigation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.startButtonText}>Start Navigation</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoutePlanScreen;

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  meetingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  meetingName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  meetingDetails: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  startButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
