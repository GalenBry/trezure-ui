import React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

type GameMapProps = {

}

const GameMap = ({ }: GameMapProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Masdasdasdas ap</Text>
      <MapView
        showsUserLocation={true}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
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