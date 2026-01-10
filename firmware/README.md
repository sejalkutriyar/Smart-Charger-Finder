# Smart Charger Firmware

This directory contains the PlatformIO project for the ESP32 Smart Charger.

## Hardware Requirements
- ESP32 Development Board (e.g., ESP32-WROOM-32)
- Piezo Buzzer connected to **GPIO 23**
- (Optional) LED connected to **GPIO 2** (On-board LED)

## Features
- **BLE Advertising**: Device name "Smart_Charger_001"
- **Buzzer Service**:
  - Service UUID: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
  - Buzzer Characteristic: `beb5483e-36e1-4688-b7f5-ea07361b26a8` (Write `0x01` to START, `0x00` to STOP)
- **Battery Service**:
  - Simulates battery drain (1% drop every 5 seconds)
  - Standard UUID `180F`

## Setup & Flashing
1.  Install [PlatformIO](https://platformio.org/) in VS Code.
2.  Open this `firmware` folder in VS Code.
3.  Connect ESP32 via USB.
4.  Run **PlatformIO: Upload** task.
5.  Open Serial Monitor (115200 baud) to view logs.
