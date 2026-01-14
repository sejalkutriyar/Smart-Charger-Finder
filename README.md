# Smart Charger Finder

Welcome to the **Smart Charger Finder** project! This system helps you locate your smart charger using a React Native mobile application and an ESP32-based hardware device.

## Project Structure

This repository is organized into the following components:

*   **[mobile-app](./mobile-app)**: The React Native (Expo) mobile application. It handles BLE scanning, proximity radar, and sending commands to the charger.
*   **[firmware](./firmware)**: The PlatformIO project for the ESP32 firmware. It handles BLE advertising and buzzer control.
*   **[backend](./backend)**: (Optional) Backend services for the project.

## Features

*   **BLE Scanning**: Easily find your "Smart_Charger_001" device.
*   **Proximity Radar**: Visualize how close you are to the charger using RSSI signal strength.
*   **Buzzer Control**: Trigger a buzzer on the charger to locate it audibly.

## Getting Started

To get the full system up and running, you will need to set up both the firmware and the mobile app.

### 1. Firmware Setup
Navigate to the `firmware/` directory and follow the instructions in the [Firmware README](./firmware/README.md) to flash your ESP32 device.

### 2. Mobile App Setup
Navigate to the `mobile-app/` directory and follow the instructions in the [Mobile App README](./mobile-app/README.md) to install dependencies and run the app on your phone.

## License
[Add License Here if applicable]
