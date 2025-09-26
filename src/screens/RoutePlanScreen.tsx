import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import NearestLeadNavigator from "../services/location/NearestLeadNavigator";

type Meeting = {
  id: number;
  name: string;
  type: string;
  time: string;
};

type RouteData = {
  totalDistance: string;
  estimatedTime: string;
  meetings: Meeting[];
};

// JSON Data
const routeData: RouteData = {
  totalDistance: "1434.3 km",
  estimatedTime: "73 hr 3 min",
  meetings: [
    { id: 1, name: "Neha Verma", type: "Followup", time: "2:45 PM" },
    {
      id: 2,
      name: "Premier Industries Corp",
      type: "Followup",
      time: "9:00 AM",
    },
    { id: 3, name: "Sanjay Sharma", type: "Meeting", time: "4:45 PM" },
    {
      id: 4,
      name: "Premier Industries Pvt Ltd",
      type: "Call",
      time: "9:30 AM",
    },
  ],
};

const RoutePlanScreen = ({ navigation }: any) => {
  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        {/* Header Section */}
        <Text style={styles.title}>Optimized Route Plan</Text>
        <Text style={styles.subtitle}>
          The most efficient route to visit your scheduled meetings.
        </Text>

        {/* Summary Section */}
        <View style={styles.summary}>
          <View>
            <Text style={styles.label}>Total Distance</Text>
            <Text style={styles.value}>{routeData.totalDistance}</Text>
          </View>
          <View>
            <Text style={styles.label}>Estimated Time</Text>
            <Text style={styles.value}>{routeData.estimatedTime}</Text>
          </View>
        </View>

        {/* Meetings List */}
        <View style={styles.meetingContainer}>
          <Text style={styles.listTitle}>Optimized Meeting Order</Text>
          <FlatList
            data={routeData.meetings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.meetingItem}>
                <View style={styles.circle}>
                  <Text style={styles.circleText}>{index + 1}</Text>
                </View>
                <View style={styles.meetingInfo}>
                  <Text style={styles.meetingName}>{item.name}</Text>
                  <Text style={styles.meetingDetails}>
                    {item.type} • {item.time}
                  </Text>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        </View>

        {/* Note Section */}
        <Text style={styles.note}>
          Note: This is an approximate route based on straight-line distances.
          Actual travel times may vary based on traffic and road conditions.
        </Text>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        {/* <NearestLeadNavigator /> */}
      </View>
    </SafeAreaView>
  );
};

export default RoutePlanScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 2,
  },
  meetingContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  meetingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  circleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  meetingInfo: {
    flex: 1,
  },
  meetingName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  meetingDetails: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  note: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
