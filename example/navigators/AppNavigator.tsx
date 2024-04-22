import type {NavigationProp} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConnectWithTokenScreen from '../screens/ConnectWithTokenScreen';
import ConnectWithRoomManagerScreen from '../screens/ConnectWithRoomManagerScreen';
import RoomScreen from '../screens/RoomScreen';
import React from 'react';
import PreviewScreen from '../screens/PreviewScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {AdditionalColors, BrandColors} from '../utils/Colors';

export type AppRootStackParamList = {
  Home: undefined;
  Preview: undefined;
  Room: undefined;
};

export type TabParamList = {
  ConnectWithToken: undefined;
  ConnectWithRoomManager: undefined;
};

const tabBarIcon =
  (icon: keyof typeof MaterialCommunityIcons.glyphMap) =>
  ({color}: {color: string}) =>
    <MaterialCommunityIcons name={icon} size={24} color={color} />;

export type AppStackNavigation = NavigationProp<AppRootStackParamList>;

const Stack = createNativeStackNavigator<AppRootStackParamList>();

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false, tabBarHideOnKeyboard: true}}>
      <Tab.Screen
        name="ConnectWithToken"
        component={ConnectWithTokenScreen}
        options={{
          tabBarLabel: 'Use Token',
          tabBarActiveTintColor: BrandColors.darkBlue100,
          tabBarInactiveTintColor: AdditionalColors.grey60,
          tabBarIcon: tabBarIcon('ticket'),
        }}
      />
      <Tab.Screen
        name="ConnectWithRoomManager"
        component={ConnectWithRoomManagerScreen}
        options={{
          tabBarLabel: 'Use Room Manager',
          tabBarActiveTintColor: BrandColors.darkBlue100,
          tabBarInactiveTintColor: AdditionalColors.grey60,
          tabBarIcon: tabBarIcon('room-service'),
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
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={TabNavigator}
        />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
