// ... (Previous Includes and Defines)

#define BATTERY_SERVICE_UUID   "180F"
#define BATTERY_LEVEL_UUID     "2A19"

NimBLECharacteristic* pBatteryCharacteristic = NULL;
int simulatedBatteryLevel = 100;
unsigned long lastBatteryUpdate = 0;

// ... (Previous Callbacks)

void setup() {
    // ... (Previous Setup Code)
    
    // Create Battery Service
    NimBLEService *pBatService = pServer->createService(BATTERY_SERVICE_UUID);
    pBatteryCharacteristic = pBatService->createCharacteristic(
                                 BATTERY_LEVEL_UUID,
                                 NIMBLE_PROPERTY::READ |
                                 NIMBLE_PROPERTY::NOTIFY
                             );
    pBatService->start();
    
    // ... (Previous Advertising Code)
    pAdvertising->addServiceUUID(BATTERY_SERVICE_UUID);
    // ...
}

void loop() {
    // ... (Previous Re-advertising logic)

    // Simulate Power/Battery Drain
    if (millis() - lastBatteryUpdate > 5000) { // Every 5 seconds
        lastBatteryUpdate = millis();
        simulatedBatteryLevel--;
        if (simulatedBatteryLevel < 0) simulatedBatteryLevel = 100;
        
        pBatteryCharacteristic->setValue(simulatedBatteryLevel);
        if (deviceConnected) {
            pBatteryCharacteristic->notify();
            Serial.printf("Battery Level: %d%%\n", simulatedBatteryLevel);
        }
    }
    
    delay(10);
}
