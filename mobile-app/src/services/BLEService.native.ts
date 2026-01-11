import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const BUZZER_CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const BATTERY_SERVICE_UUID = "180F";
const BATTERY_LEVEL_UUID = "2A19";

class BLEService {
    manager: BleManager;
    device: Device | null = null;

    constructor() {
        this.manager = new BleManager();
    }

    async requestPermissions() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
            return granted;
        }
        return true;
    }

    scanForDevices(onDeviceFound: (device: Device) => void) {
        this.manager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }
            if (device && device.name === 'Smart_Charger_001') {
                onDeviceFound(device); // Device found
            }
        });
    }

    stopScan() {
        this.manager.stopDeviceScan();
    }

    async connectToDevice(deviceId: string) {
        try {
            this.device = await this.manager.connectToDevice(deviceId);
            await this.device.discoverAllServicesAndCharacteristics();
            return this.device;
        } catch (error) {
            console.error("Connection failed", error);
            throw error;
        }
    }

    async disconnect() {
        if (this.device) {
            await this.device.cancelConnection();
            this.device = null;
        }
    }

    async toggleBuzzer(on: boolean) {
        if (!this.device) return;
        const val = on ? 'AQ==' : 'AA=='; // Base64 for 0x01 and 0x00
        await this.device.writeCharacteristicWithResponseForService(
            SERVICE_UUID,
            BUZZER_CHAR_UUID,
            val
        );
    }

    // Stub for monitoring signal strength
    async readRSSI() {
        if (!this.device) return -100;
        const device = await this.device.readRSSI();
        return device.rssi;
    }
}

export const bleService = new BLEService();
