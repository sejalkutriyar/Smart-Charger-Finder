# Smart Charger Mobile App

React Native (Expo) application for tracking the Smart Charger.

## Features
- **BLE Scanning**: Finds "Smart_Charger_001"
- **Proximity Radar**: Shows RSSI signal strength
- **Buzzer Control**: Ring the charger remotely

## Setup
1.  Run `npm install` inside this directory.
2.  Run `npx expo start`.
3.  Scan QR code with Expo Go (Android/iOS).

## Bluetooth on Android
- This app requires `BLUETOOTH_SCAN` and `BLUETOOTH_CONNECT` permissions.
- On Android 12+, request logic is handled in `BLEService.ts`.
- Ensure Location is enabled.

## Code Structure
- `src/services/BLEService.ts`: BLE Logic
- `src/screens/HomeScreen.tsx`: Main UI
