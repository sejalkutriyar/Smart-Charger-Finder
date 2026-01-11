import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { bleService } from '../services/BLEService';
import type { Device } from 'react-native-ble-plx';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [device, setDevice] = useState<Device | null>(null);
    const [connected, setConnected] = useState(false);
    const [rssi, setRssi] = useState<number | null>(null);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        const init = async () => {
            await bleService.requestPermissions();
        };
        init();
        return () => bleService.stopScan();
    }, []);

    const scanAndConnect = () => {
        setScanning(true);
        bleService.scanForDevices(async (scannedDevice) => {
            bleService.stopScan();
            setScanning(false);
            try {
                const connectedDevice = await bleService.connectToDevice(scannedDevice.id);
                setDevice(connectedDevice);
                setConnected(true);
                Alert.alert("Connected", "Found Smart Charger!");

                // Start RSSI polling
                const interval = setInterval(async () => {
                    if (await bleService.device?.isConnected()) {
                        const r = await bleService.readRSSI();
                        setRssi(r);
                    } else {
                        clearInterval(interval);
                        setConnected(false);
                        setDevice(null);
                    }
                }, 1000);

            } catch (e) {
                Alert.alert("Error", "Failed to connect");
            }
        });
    };

    const toggleBuzzer = async () => {
        try {
            await bleService.toggleBuzzer(true);
            setTimeout(() => bleService.toggleBuzzer(false), 2000); // Beep for 2s
        } catch (e) {
            console.error(e);
        }
    };

    const getDistanceLabel = (rssi: number) => {
        if (rssi > -60) return "Very Close";
        if (rssi > -80) return "Nearby";
        return "Far";
    }

    const getSignalColor = (rssi: number | null) => {
        if (!rssi) return '#6b7280'; // gray-500
        if (rssi > -60) return '#10b981'; // green-500
        if (rssi > -80) return '#f59e0b'; // yellow-500
        return '#ef4444'; // red-500
    }

    return (
        <LinearGradient
            colors={['#0f172a', '#1e293b', '#0f172a']}
            style={styles.container}
        >
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.title}>Smart Charger Finder</Text>
                    <Text style={styles.subtitle}>Locate your device securely</Text>
                </View>

                <View style={styles.content}>
                    {!connected ? (
                        <View style={styles.centerContent}>
                            <TouchableOpacity
                                onPress={scanAndConnect}
                                disabled={scanning}
                                style={styles.scanButton}
                            >
                                <LinearGradient
                                    colors={['#3b82f6', '#2563eb']}
                                    style={styles.scanGradient}
                                >
                                    {scanning ? (
                                        <ActivityIndicator color="white" size="large" />
                                    ) : (
                                        <Text style={styles.scanButtonText}>Find Charger</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                            {scanning && <Text style={styles.statusText}>Scanning for devices...</Text>}
                        </View>
                    ) : (
                        <View style={styles.dashboard}>
                            <View style={[styles.signalCircle, { borderColor: getSignalColor(rssi), shadowColor: getSignalColor(rssi) }]}>
                                <Text style={styles.rssiValue}>{rssi ? `${rssi} dBm` : '--'}</Text>
                                <Text style={styles.rssiLabel}>{rssi ? getDistanceLabel(rssi) : 'Calculating...'}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={toggleBuzzer}
                                style={styles.actionButton}
                            >
                                <LinearGradient
                                    colors={['#ef4444', '#dc2626']}
                                    style={styles.actionGradient}
                                >
                                    <Text style={styles.actionButtonText}>📢 PLAY SOUND</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={async () => {
                                    await bleService.disconnect();
                                    setConnected(false);
                                    setDevice(null);
                                }}
                                style={styles.disconnectButton}
                            >
                                <Text style={styles.disconnectText}>Disconnect</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        marginTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 4,
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        elevation: 10,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    scanGradient: {
        flex: 1,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
    },
    statusText: {
        marginTop: 20,
        color: '#94a3b8',
        fontSize: 16,
    },
    dashboard: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    signalCircle: {
        width: 260,
        height: 260,
        borderRadius: 130,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
    },
    rssiValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    rssiLabel: {
        fontSize: 20,
        color: '#cbd5e1',
        marginTop: 10,
        fontWeight: '500',
    },
    actionButton: {
        width: '100%',
        height: 60,
        borderRadius: 15,
        marginBottom: 16,
        overflow: 'hidden',
    },
    actionGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
    },
    disconnectButton: {
        padding: 16,
    },
    disconnectText: {
        color: '#64748b',
        fontSize: 16,
    },
});
