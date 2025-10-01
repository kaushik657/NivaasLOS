import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";
import { DraggableFlatList } from "../components/DraggableFlatlist";
import {
  requestLocationPermission,
  getCurrentLocation,
  openGoogleMapsWithMarkers,
} from "../services/location/LocationHelper";
import { fetchTodayLeads } from "../services/Api";
import Feather from "react-native-vector-icons/Feather";

const ITEM_HEIGHT = 70;
const SCREEN_HEIGHT = Dimensions.get("window").height;

function generateColors(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const hue = (i * 360) / count;
    return `hsl(${hue}, 70%, 50%)`;
  });
}

export default function RoutePlanScreen() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    })();
  }, []);

  useEffect(() => {
    async function fetchLeads() {
      const leadsResult = await fetchTodayLeads();
      if (!leadsResult || leadsResult.length === 0) return;

      const filteredLeads = leadsResult.filter(
        (lead: any) => lead.Location__c?.latitude && lead.Location__c?.longitude
      );

      const colors = generateColors(filteredLeads.length);

      const mappedLeads = filteredLeads.map((lead: any, index: number) => ({
        id: lead.Id,
        name: lead.Name || "No Name",
        type: lead.Status || "New",
        time: new Date(lead.CreatedDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        latitude: lead.Location__c.latitude,
        longitude: lead.Location__c.longitude,
        color: colors[index] || "#ccc",
      }));

      setMeetings(mappedLeads);
    }

    fetchLeads();
  }, []);

  // Calculate map region dynamically
  let mapRegion = null;
  const validPoints = [
    ...(currentLocation
      ? [
          {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
        ]
      : []),
    ...meetings,
  ];

  if (validPoints.length > 0) {
    const latitudes = validPoints.map((p) => p.latitude);
    const longitudes = validPoints.map((p) => p.longitude);

    mapRegion = {
      latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
      longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
      latitudeDelta:
        (Math.max(...latitudes) - Math.min(...latitudes)) * 1.5 || 0.05,
      longitudeDelta:
        (Math.max(...longitudes) - Math.min(...longitudes)) * 1.5 || 0.05,
    };
  }

  const handleStartNavigation = async () => {
    if (!currentLocation || meetings.length === 0) return;
    openGoogleMapsWithMarkers(currentLocation, meetings);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={{ flexDirection: "row" }}>
            <Feather
              name="navigation"
              size={30}
              color="black"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.title}>Optimized Route Plan</Text>
          </View>
          <Text style={styles.subTitle}>
            The most efficient route to visit your scheduled meetings.
          </Text>

          <View style={[styles.mapWrapper, { height: SCREEN_HEIGHT * 0.4 }]}>
            {mapRegion && (
              <MapView
                style={styles.map}
                region={mapRegion}
                scrollEnabled={true}
                zoomEnabled={true}
                rotateEnabled={true}
                pitchEnabled={true}
                zoomTapEnabled={true}
                minZoomLevel={3}
                maxZoomLevel={20}
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
                    pinColor={meeting.color}
                  />
                ))}
              </MapView>
            )}
          </View>

          {meetings.length > 0 && (
            <DraggableFlatList
              data={meetings}
              itemHeight={ITEM_HEIGHT}
              keyExtractor={(item) => item.id.toString()}
              renderItem={(item, index, isDragging) => (
                <View
                  style={[
                    styles.meetingItem,
                    {
                      borderLeftColor: item.color || "#ccc",
                      opacity: 1,
                    },
                    isDragging && styles.draggingItem,
                  ]}
                >
                  <Text style={styles.meetingName}>{item.name}</Text>
                  <Text style={styles.meetingDetails}>
                    {item.type} • {item.time}
                  </Text>
                </View>
              )}
              onDragEnd={(updated) => setMeetings(updated || [])}
            />
          )}

          <View style={styles.buttonWrapper}>
            <Text style={styles.startButton} onPress={handleStartNavigation}>
              Optimized Route Path
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    // padding: 16,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  subTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: "#6b7280",
  },
  mapWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
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
    borderLeftWidth: 6,
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
