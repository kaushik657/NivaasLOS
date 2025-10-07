import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";
import { DraggableFlatList } from "../components/DraggableFlatlist";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {
  requestLocationPermission,
  getCurrentLocation,
  openGoogleMapsWithMarkers,
} from "../services/location/LocationHelper";
import { fetchTodayLeads } from "../services/Api";
import Feather from "react-native-vector-icons/Feather";
import Loader from "../components/Loader"; // ✅ import loader
import { LatLng, calculateRoute } from "../utils/routeUtils"; // ✅ import route utils

const ITEM_HEIGHT = verticalScale(70);
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
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalDistance, setTotalDistance] = useState("--");
  const [estimatedTimeStr, setEstimatedTimeStr] = useState("--");

  const polylineCoords = [
    ...(currentLocation ? [currentLocation] : []),
    ...meetings.map((meeting) => ({
      latitude: meeting.latitude,
      longitude: meeting.longitude,
    })),
  ];
  console.log("polyyyyyy", polylineCoords);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const granted = await requestLocationPermission();
        if (granted) {
          const location = await getCurrentLocation();
          setCurrentLocation(location);
        }

        const leadsResult = await fetchTodayLeads();
        if (leadsResult && leadsResult.length > 0) {
          const filteredLeads = leadsResult.filter(
            (lead: any) =>
              lead.Location__c?.latitude && lead.Location__c?.longitude
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
      } catch (error) {
        console.log("Error in route plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update dynamic distance and time
  useEffect(() => {
    if (currentLocation && meetings.length > 0) {
      const points = meetings.map((m) => ({
        latitude: m.latitude,
        longitude: m.longitude,
      }));
      const { totalDistance, estimatedTime } = calculateRoute(
        currentLocation,
        points
      );
      setTotalDistance(totalDistance);
      setEstimatedTimeStr(estimatedTime);
    }
  }, [currentLocation, meetings]);

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
      {/* Loader */}
      <Loader visible={loading} />

      {!loading && (
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!dragging}
        >
          <View style={styles.card}>
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather
                name="navigation"
                size={28}
                color="#111827"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.title}>Optimized Route Plan</Text>
            </View>
            <Text style={styles.subTitle}>
              The most efficient route to visit your scheduled meetings.
            </Text>

            {/* Distance / Time Section */}
            <View style={styles.statsWrapper}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Distance</Text>
                <Text style={styles.statValue}>{totalDistance}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Estimated Time</Text>
                <Text style={styles.statValue}>{estimatedTimeStr}</Text>
              </View>
            </View>

            {/* Map */}
            <View style={[styles.mapWrapper, { height: SCREEN_HEIGHT * 0.4 }]}>
              {mapRegion && (
                <MapView
                  style={styles.map}
                  region={mapRegion}
                  provider="google"
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
                  {polylineCoords.length > 1 && (
                    <Polyline
                      coordinates={polylineCoords}
                      strokeColor="#007AFF"
                      strokeWidth={4}
                      lineDashPattern={[1]}
                    />
                  )}
                  {polylineCoords.length > 2 && (
                    <Polygon
                      coordinates={polylineCoords}
                      fillColor="rgba(0,122,255,0.2)" // semi-transparent fill
                      strokeColor="#007AFF" // border color
                      strokeWidth={2}
                    />
                  )}
                </MapView>
              )}
            </View>

            {/* Draggable List */}
            {meetings.length > 0 && (
              <DraggableFlatList
                data={meetings}
                itemHeight={ITEM_HEIGHT}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(item, index, isDragging) => (
                  <View
                    style={[
                      styles.meetingItem,
                      { borderLeftColor: item.color || "#ccc" },
                      isDragging && styles.draggingItem,
                    ]}
                  >
                    <Text style={styles.meetingName}>{item.name}</Text>
                    <Text style={styles.meetingDetails}>
                      {item.type} • {item.time}
                    </Text>
                  </View>
                )}
                onDragBegin={() => setDragging(true)}
                onDragEnd={(updated) => {
                  setDragging(false);
                  setMeetings(updated || []);
                }}
              />
            )}

            {/* Note */}
            <Text style={[styles.subTitle, { marginVertical: 10 }]}>
              Note: This is an approximate route based on straight-line
              distances. Actual travel times may vary based on traffic and road
              conditions.
            </Text>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={handleStartNavigation}
                activeOpacity={0.8}
              >
                <Feather
                  name="map-pin"
                  size={20}
                  color="#3C82F6"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.navigationButtonText}>
                  Open in Google Maps
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f4f6", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    width: "95%",
    padding: moderateScale(20),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    marginVertical: verticalScale(10),
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowRadius: moderateScale(8),
    elevation: 4,
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: verticalScale(5),
    color: "#111827",
  },
  subTitle: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(10),
    color: "#6b7280",
  },
  statsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
    paddingVertical: verticalScale(10),
    paddingRight: scale(10),
  },
  statBox: { alignItems: "flex-start" },
  statLabel: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginBottom: verticalScale(5),
  },
  statValue: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#111827",
  },
  mapWrapper: {
    width: "100%",
    borderRadius: moderateScale(16),
    overflow: "hidden",
    marginBottom: verticalScale(10),
  },
  map: { ...StyleSheet.absoluteFillObject },
  meetingItem: {
    height: ITEM_HEIGHT,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderRadius: moderateScale(8),
    marginVertical: verticalScale(4),
    borderLeftWidth: scale(6),
  },
  draggingItem: { backgroundColor: "#dbeafe" },
  meetingName: { fontSize: moderateScale(16), fontWeight: "500" },
  meetingDetails: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    marginTop: verticalScale(2),
  },
  buttonWrapper: { marginTop: verticalScale(10), width: "100%" },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", // white background
    borderWidth: 2,
    borderColor: "#3C82F6", // blue border
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
  },
  navigationButtonText: {
    color: "#2563EB", // blue text
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: "#2563EB",
    color: "#fff",
    textAlign: "center",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
