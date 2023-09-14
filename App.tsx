import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HuntMap from './components/map/HuntMap';

const Drawer = createDrawerNavigator();
const App = (): JSX.Element => {

  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          component={HuntMap}
          options={{
            headerShown: false
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
