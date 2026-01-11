require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-charger';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Schemas
const DeviceSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: String,
    macAddress: String,
    lastSeen: { type: Date, default: Date.now }
});

const HistorySchema = new mongoose.Schema({
    deviceId: String,
    type: String, // 'connect', 'disconnect'
    location: {
        lat: Number,
        lng: Number
    },
    timestamp: { type: Date, default: Date.now }
});

const Device = mongoose.model('Device', DeviceSchema);
const History = mongoose.model('History', HistorySchema);

app.get('/', (req, res) => {
    res.send({ status: 'active', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Register or Update Device
app.post('/api/v1/devices', async (req, res) => {
    try {
        const { name, macAddress } = req.body;
        // Simple ID generation based on MAC for demo uniqueness
        const id = 'dev_' + macAddress.replace(/:/g, '');

        const device = await Device.findOneAndUpdate(
            { macAddress },
            { id, name, macAddress, lastSeen: new Date() },
            { upsert: true, new: true }
        );

        console.log(`Registered device: ${name} (${id})`);
        res.json({ message: "Device registered", id: device.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Log History
app.post('/api/v1/history', async (req, res) => {
    try {
        const { deviceId, type, latitude, longitude } = req.body;
        const event = new History({
            deviceId,
            type,
            location: { lat: latitude, lng: longitude }
        });
        await event.save();
        console.log(`New Event: ${type} for ${deviceId}`);
        res.json({ message: "Event logged" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get History
app.get('/api/v1/history/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        const events = await History.find({ deviceId }).sort({ timestamp: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
