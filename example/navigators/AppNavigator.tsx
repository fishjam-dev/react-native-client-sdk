import type {NavigationProp} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConnectScreen from '../screens/ConnectScreen';
import ConnectWithRoomManagerScreen from '../screens/ConnectWithRoomManager';
import RoomScreen from '../screens/RoomScreen';
import React from 'react';
import PreviewScreen from '../screens/PreviewScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

export type AppRootStackParamList = {
  Home: undefined;
  Preview: undefined;
  Room: undefined;
};

export type TabParamList = {
  ConnectWithToken: undefined;
  ConnectWithRoomManager: undefined;
};

export type AppStackNavigation = NavigationProp<AppRootStackParamList>;

const Stack = createNativeStackNavigator<AppRootStackParamList>();

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="ConnectWithToken"
        component={ConnectScreen}
        options={{tabBarLabel: 'Connect with Token'}}
      />
      <Tab.Screen
        name="ConnectWithRoomManager"
        component={ConnectWithRoomManagerScreen}
        options={{
          tabBarLabel: 'Connect with Room Manager',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={() => ({
          headerBackTitleVisible: false,
          headerBackVisible: false,
        })}>
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
