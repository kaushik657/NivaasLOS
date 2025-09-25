// src/components/LocationCard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import {
  requestLocationPermission,
  getAddressFromCoordinates,
} from './LocationHelper';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import { Colors } from '../../constants/colors';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationCardProps {
  visible: boolean; // will decide when to show the card
}

const LocationCard: React.FC<LocationCardProps> = ({ visible }) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      fetchLocation();
    }
  }, [visible]);

  const fetchLocation = async () => {
    setLoading(true);
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async (position: GeoPosition) => {
        const { latitude, longitude } = position.coords;
        const coords = { latitude, longitude };
        setLocation(coords);

        try {
          const fetchedAddress = await getAddressFromCoordinates(latitude, longitude);
          setAddress(fetchedAddress);
        } catch (error) {
          console.error('Address Fetch Error:', error);
          setAddress('Unable to fetch address');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Location Error:', error);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  if (!visible) return null;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Fetching location...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Unable to fetch location</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Static Map Image */}
      <Image
        source={require('../assets/images/staticMap.png')} // <-- Your static map image
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* Location Details */}
      <View style={styles.infoContainer}>
        <Text style={styles.address} numberOfLines={2}>
          {address || 'Fetching address...'}
        </Text>
        <Text style={styles.text}>Lat: {location.latitude.toFixed(6)}</Text>
        <Text style={styles.text}>Long: {location.longitude.toFixed(6)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(16),
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(14),
    color: Colors.TEXT_GRAY,
  },
  errorText: {
    fontSize: moderateScale(14),
    color: Colors.CROWN,
  },
  card: {
    flexDirection: 'row',
    borderRadius: moderateScale(12),
    backgroundColor: Colors.WHITE,
    overflow: 'hidden',
    elevation: 4, // Android shadow
    shadowColor: Colors.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: verticalScale(16),
  },
  mapImage: {
    width: scale(150),
    height: verticalScale(150),
  },
  infoContainer: {
    flex: 1,
    padding: moderateScale(12),
    justifyContent: 'center',
  },
  address: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: verticalScale(8),
    color: Colors.BLACK,
  },
  text: {
    fontSize: moderateScale(13),
    color: Colors.TEXT_GRAY,
    marginTop: verticalScale(4),
  },
});

export default LocationCard;
