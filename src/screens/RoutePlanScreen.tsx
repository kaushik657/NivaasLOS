import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";
import Feather from "react-native-vector-icons/Feather";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {
  requestLocationPermission,
  getCurrentLocation,
  openGoogleMapsWithMarkers,
} from "../services/location/LocationHelper";
import { fetchTodayLeads } from "../services/Api";
import { LatLng, calculateRoute } from "../utils/routeUtils";
import { Colors } from "../constants/colors";
import NewLoader from "../components/NewLoader";
import NewFlatlist from "../components/NexFlatlist";
import { MenuProvider } from "react-native-popup-menu";

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
  const [refreshing, setRefreshing] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const polylineCoords = [
    ...(currentLocation ? [currentLocation] : []),
    ...meetings.map((meeting) => ({
      latitude: meeting.latitude,
      longitude: meeting.longitude,
    })),
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

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
        else{
          setMeetings([]);
          setEstimatedTimeStr("--");
          setTotalDistance("--");
        }
      } catch (error) {
        console.log("Error in route plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshing]);

  // Update distance & estimated time dynamically
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

  // Map region calculation
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

  const handleStartNavigation = () => {
    if (!currentLocation || meetings.length === 0) return;
    openGoogleMapsWithMarkers(currentLocation, meetings);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <NewLoader
        visible={loading}
        type="LineScalePulseOutRapid"
        color="#6f421b"
      />

      <ScrollView
        ref={scrollRef}
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!dragging}
        nestedScrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0a84ff"]}
            tintColor="#0a84ff"
            title="Refreshing..."
          />
        }
      >
        <View style={styles.card}>
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

          <View style={[styles.mapWrapper, { height: SCREEN_HEIGHT * 0.4 }]}>
            {mapRegion && (
              <MapView style={styles.map} region={mapRegion} provider="google">
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
                    fillColor="rgba(0,122,255,0.2)"
                    strokeColor="#007AFF"
                    strokeWidth={2}
                  />
                )}
              </MapView>
            )}
          </View>

          {meetings.length > 0 && (
            <MenuProvider>
              <NewFlatlist
                data={meetings}
                setData={setMeetings}
                onDragStart={() => setDragging(true)}
                onDragEnd={() => setDragging(false)}
                simultaneousHandlers={scrollRef} // crucial fix
              />
            </MenuProvider>
          )}

          <Text style={[styles.subTitle, { marginVertical: 10 }]}>
            Note: This is an approximate route based on straight-line distances.
            Actual travel times may vary based on traffic and road conditions.
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
    color: Colors.BLACK,
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
    color: Colors.BLACK,
  },
  mapWrapper: {
    width: "100%",
    borderRadius: moderateScale(16),
    overflow: "hidden",
    marginBottom: verticalScale(10),
  },
  map: { ...StyleSheet.absoluteFillObject },
  buttonWrapper: { marginTop: verticalScale(10), width: "100%" },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#3C82F6",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
  },
  navigationButtonText: {
    color: "#2563EB",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
