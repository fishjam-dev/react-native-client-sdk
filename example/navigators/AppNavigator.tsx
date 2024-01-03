import type {NavigationProp} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConnectScreen from '../screens/ConnectScreen';
import RoomScreen from '../screens/RoomScreen';
import React from 'react';
import PreviewScreen from '../screens/PreviewScreen';

export type AppRootStackParamList = {
  Connect: undefined;
  Preview: undefined;
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
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
