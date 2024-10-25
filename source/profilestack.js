import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import Dologin from '../screens/dologin'
import Profilescreens from '../screens/profile'
import Loginscreens from '../screens/login'
import Registerscreens from '../screens/register'

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dologin" component={Dologin} />
      <Stack.Screen name="Profile" component={Profilescreens} />
      <Stack.Screen name="Login" component={Loginscreens} />
      <Stack.Screen name="Register" component={Registerscreens} />
    </Stack.Navigator>
  );
}

const Profilestack = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser); // 사용자 정보 설정
    }
    setInitializing(false);

    return subscriber; // unsubscribe on unmount

  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <MyStack />
    );
  }
  return (
    <Profilescreens />
  );
}

export default Profilestack;
