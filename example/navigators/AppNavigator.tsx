import {NavigationContainer, NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConnectScreen from '../src/screens/ConnectScreen';
import RoomScreen from '../src/screens/RoomScreen';
import React from 'react';

export type AppRootStackParamList = {
  Connect: undefined;
  Room: undefined;
};

export type AppStackNavigation = NavigationProp<AppRootStackParamList>;

const Stack = createNativeStackNavigator<AppRootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Connect"
        screenOptions={() => ({
          headerBackTitleVisible: false,
          headerBackVisible: false,
        })}>
        <Stack.Screen name="Connect" component={ConnectScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
