import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import { Colors } from '../constants/colors';
import CameraCapture from '../components/CameraCapture';

export const DocUploadScreen = () => {
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleAddPhoto = (index: number) => {
    setSelectedIndex(index);
    setShowCamera(true);
  };

  const handlePhotoCaptured = (photoPath: string) => {
    if (selectedIndex === null) return;

    setImages(prev => {
      const updated = [...prev];
      updated[selectedIndex] = photoPath;
      return updated;
    });

    setShowCamera(false);
    setSelectedIndex(null);
  };

  const renderItem = ({ item, index }: { item: string | null; index: number }) => (
    <TouchableOpacity
      style={styles.imageBox}
      onPress={() => handleAddPhoto(index)}
      activeOpacity={0.7}
    >
      {item ? (
        <Image source={{ uri: item }} style={styles.image} />
      ) : (
        <View style={styles.plusContainer}>
          <Image
            source={require('../assets/plus.png')}
            style={styles.plusIcon}
            resizeMode="contain"
          />
          <Text style={styles.plusText}>Add more</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handlePhotoCaptured}
        onClose={() => {
          setShowCamera(false);
          setSelectedIndex(null);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
    backgroundColor: Colors.WHITE,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  imageBox: {
    width: '48%',
    height: verticalScale(170),
    backgroundColor: Colors.BACKGROUND_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  plusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(10),
  },
  plusIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    marginBottom: verticalScale(8),
  },
  plusText: {
    fontSize: moderateScale(14),
    color: Colors.TEXT_GRAY,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Montserrat', // added
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(12),
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginVertical: verticalScale(10),
  },
  submitText: {
    fontSize: moderateScale(14),
    color: Colors.WHITE,
    fontWeight: '700',
    fontFamily: 'Montserrat', // added
  },
});

