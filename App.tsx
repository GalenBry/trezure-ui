import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Geolocation from 'react-native-geolocation-service';

import HuntMap from './components/map/HuntMap';

const Stack = createNativeStackNavigator();

const App = (): JSX.Element => {
  const [initialUserLocation, setInitialUserLocation] = useState({} as Geolocation.GeoPosition)
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HuntMap}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
