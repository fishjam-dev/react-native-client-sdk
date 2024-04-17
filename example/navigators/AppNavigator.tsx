import type {NavigationProp} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConnectWithTokenScreen from '../screens/ConnectWithTokenScreen';
import ConnectWithRoomManagerScreen from '../screens/ConnectWithRoomManagerScreen';
import RoomScreen from '../screens/RoomScreen';
import React from 'react';
import PreviewScreen from '../screens/PreviewScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Typo} from '../components';

export type AppRootStackParamList = {
  Home: undefined;
  Preview: undefined;
  Room: undefined;
};

export type TabParamList = {
  ConnectWithToken: undefined;
  ConnectWithRoomManager: undefined;
};

const tabBarIcon = (icon: string) => () =>
  <Typo variant="body-big">{icon}</Typo>;

export type AppStackNavigation = NavigationProp<AppRootStackParamList>;

const Stack = createNativeStackNavigator<AppRootStackParamList>();

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="ConnectWithToken"
        component={ConnectWithTokenScreen}
        options={{
          tabBarLabel: 'Use Token',
          tabBarIcon: tabBarIcon('🎟️'),
        }}
      />
      <Tab.Screen
        name="ConnectWithRoomManager"
        component={ConnectWithRoomManagerScreen}
        options={{
          tabBarLabel: 'Use Room Manager',
          tabBarIcon: tabBarIcon('🏢'),
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
