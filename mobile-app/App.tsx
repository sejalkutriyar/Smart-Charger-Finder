import { StatusBar } from 'expo-status-bar';
import React from 'react';
import HomeScreen from './src/screens/HomeScreen';
import { View } from 'react-native';
// import "./global.css";

// Note: NativeWind setup requires a global.css file, but we can rely on className for now if configured
// For simplicity in this demo, we assume NativeWind is working via babel config.
// If actual global.css is needed, we'll create it.

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <HomeScreen />
    </>
  );
}
