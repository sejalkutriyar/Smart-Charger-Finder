# Smart Charger Backend

Optional backend service for history tracking.

## Setup
1. `npm install`
2. `npm start`

## API
- `POST /api/v1/devices`: Register new charger.
- `POST /api/v1/history`: Log disconnect/connect events.
- `GET /api/v1/history/:deviceId`: Get usage history.
