import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import DrawerToggleButton from './DrawerToggleButton';

import FloatingIconButton from './FloatingButton';

const initialCameraSettings = {
  heading: 0,
  pitch: 0,
  altitude: 20000,
  zoom: 15
}

type GameMapProps = {
}

const GameMap = ({ }: GameMapProps) => {

  // TODO: make actual default region in case user does not share location
  const [initialUserLocation, setInitialUserLocation] = useState({} as Geolocation.GeoPosition)
  const mapRef = useRef<MapView | null>(null)

  useEffect(() => {
    getUserPosition(setInitialUserLocation)
  }, [])

  const getUserPosition = (onSuccess: Geolocation.SuccessCallback, onError?: Geolocation.ErrorCallback) => {
    Geolocation.requestAuthorization("whenInUse")
    Geolocation.getCurrentPosition(
      (position) => onSuccess(position),
      (error) => {
        console.log(error.code, error.message);
        onError && onError(error)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  const animateToLocation = (location: Geolocation.GeoPosition) => {
    const longitude = location.coords.longitude
    const latitude = location.coords.latitude

    mapRef.current?.animateCamera({
      center: {
        latitude,
        longitude,
      },
      heading: 0,
      altitude: 20000,
      zoom: 15
    });
  }

  const centerOnUser = () => {
    getUserPosition(animateToLocation)
  }

  return (
    <SafeAreaView style={styles.container}>
      {initialUserLocation.coords &&
        <MapView
          ref={mapRef}
          showsUserLocation={true}
          style={styles.map}
          initialCamera={{
            ...initialCameraSettings,
            center: {
              latitude: initialUserLocation.coords.latitude,
              longitude: initialUserLocation.coords.longitude,
            },
          }}
        >
        </MapView>
      }

      <SafeAreaView style={styles.headerOptions}>
        <FloatingDrawerToggleButton />
        <FloatingRecenterButton onPress={centerOnUser}/>
      </SafeAreaView>
    </SafeAreaView>
  )
}

export default GameMap;

const FloatingDrawerToggleButton = () => (
  <FloatingIconButton containerStyles={styles.toggleDrawer}>
    <DrawerToggleButton tintColor='#22AAA5' />
  </FloatingIconButton>
)

type FloatingRecenterButtonProps = {
  onPress: () => void
}

const FloatingRecenterButton = ({ onPress }: FloatingRecenterButtonProps) => (
  <FloatingIconButton containerStyles={styles.recenterUser}>
    {/* TODO: replace this with navigation arrow icon */}
    <Button
      title='center'
      onPress={onPress}
    />
  </FloatingIconButton>
)

const styles = StyleSheet.create({
  headerOptions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  toggleDrawer: {
    height: 30,
    paddingHorizontal: 4
  },
  recenterUser: {
    alignSelf: 'flex-end',
  },
  container: {
    height: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
})