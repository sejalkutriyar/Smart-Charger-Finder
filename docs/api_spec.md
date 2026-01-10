# Smart Charger Finder - API Specification

## Base URL
`http://localhost:3000/api/v1`

## Authentication
Authentication is optional for this Hackathon MVP. We will use a simple `deviceId` header.
`x-device-id: <UUID>`

## Endpoints

### 1. Register Device
**POST** `/devices`
Registers a new charger to the user (mobile app installation).

**Request Body:**
```json
{
  "name": "My Bedroom Charger",
  "macAddress": "AA:BB:CC:11:22:33"
}
```

**Response:**
```json
{
  "message": "Device registered",
  "id": "dev_12345"
}
```

### 2. Log History Event
**POST** `/history`
Logs an event (connected, disconnected, beeped).

**Request Body:**
```json
{
  "deviceId": "dev_12345",
  "type": "DISCONNECT",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "timestamp": "2023-10-27T10:00:00Z"
}
```

### 3. Get Device History
**GET** `/history/:deviceId`
Returns list of past events.

**Response:**
```json
[
  {
    "type": "DISCONNECT",
    "location": { "lat": 37.7749, "lng": -122.4194 },
    "timestamp": "2023-10-27T10:00:00Z"
  }
]
```
