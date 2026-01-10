const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock Database
const devices = [];
const history = [];

app.get('/', (req, res) => {
    res.send('Smart Charger Backend API');
});

// Register Device
app.post('/api/v1/devices', (req, res) => {
    const { name, macAddress } = req.body;
    const id = 'dev_' + Math.floor(Math.random() * 10000);
    devices.push({ id, name, macAddress });
    console.log(`Registered device: ${name} (${id})`);
    res.json({ message: "Device registered", id });
});

// Log History
app.post('/api/v1/history', (req, res) => {
    const { deviceId, type, latitude, longitude } = req.body;
    const event = {
        deviceId,
        type,
        location: { lat: latitude, lng: longitude },
        timestamp: new Date()
    };
    history.push(event);
    console.log(`New Event: ${type} for ${deviceId}`);
    res.json({ message: "Event logged" });
});

// Get History
app.get('/api/v1/history/:deviceId', (req, res) => {
    const { deviceId } = req.params;
    const events = history.filter(h => h.deviceId === deviceId);
    res.json(events);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
