import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

import Geolocation from 'react-native-geolocation-service';

const initialCameraSettings = {
  heading: 0,
  pitch: 0,
  altitude: 20000,
  zoom: 15
}

type GameMapProps = {
}

const GameMap = ({ }: GameMapProps) => {

  const [initialUserLocation, setInitialUserLocation] = useState({} as Geolocation.GeoPosition)

  useEffect(() => {
    // TODO: abstract this process
    Geolocation.requestAuthorization("whenInUse")
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setInitialUserLocation(position)
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {initialUserLocation.coords &&
        <MapView
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
    </SafeAreaView>
  )
}

export default GameMap;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
})