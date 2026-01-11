
// Mock implementation for Web
export class BLEService {
    manager: any;
    device: any = null;

    constructor() {
        this.manager = {};
    }

    async requestPermissions() {
        return true;
    }

    scanForDevices(onDeviceFound: (device: any) => void) {
        console.log("Scanning for devices on web (Mock)...");
        // Simulate finding a device after 1 second
        setTimeout(() => {
            onDeviceFound({
                id: 'mock-device-id',
                name: 'Smart_Charger_001',
                isConnected: async () => true,
                readRSSI: async () => ({ rssi: -50 }),
                writeCharacteristicWithResponseForService: async () => { },
                discoverAllServicesAndCharacteristics: async () => { },
                cancelConnection: async () => { }
            });
        }, 1000);
    }

    stopScan() {
        console.log("Stop scan (Web)");
    }

    async connectToDevice(deviceId: string) {
        console.log("Connecting to device (Web)", deviceId);
        this.device = {
            id: deviceId,
            name: 'Smart_Charger_001',
            isConnected: async () => true,
            readRSSI: async () => ({ rssi: Math.floor(Math.random() * 20) - 70 }), // Random RSSI -50 to -70
            writeCharacteristicWithResponseForService: async () => { },
            discoverAllServicesAndCharacteristics: async () => { },
            cancelConnection: async () => { }
        };
        return this.device;
    }

    async disconnect() {
        console.log("Disconnecting (Web)");
        this.device = null;
    }

    async toggleBuzzer(on: boolean) {
        console.log(`Buzzer ${on ? 'ON' : 'OFF'} (Web)`);
    }

    async readRSSI() {
        if (!this.device) return -100;
        return Math.floor(Math.random() * 20) - 70;
    }
}

export const bleService = new BLEService();
