import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Map from './screens/map';
import Profilestack from './source/profilestack'
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Home"
          component={Map}
          options={{
            title: '홈',
            tabBarIcon: ({color, size}) => (
              <Icon name="assistant-photo" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={Profilestack}
          options={{
            title: '프로필',
            tabBarIcon: ({color, size}) => (
              <Icon name="person" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;