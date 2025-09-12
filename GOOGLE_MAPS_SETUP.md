# Google Maps API Key Setup

## Current Status
- Google Places Autocomplete structure is already implemented in `client/src/pages/Home/Home.js`
- The API key is currently disabled to prevent errors
- Location-based search works with manual input and GPS coordinates

## Setup Instructions

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API
   - Geocoding API
   - Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the key to your domains (localhost:3000 for development)

### 2. Add API Key to Environment
Create a `.env` file in your `client` folder:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Restart the Development Server
After adding the API key:
```bash
cd client
npm start
```

## Current Behavior WITHOUT API Key
- ✅ Location input works with manual typing
- ✅ GPS "Current Location" button works
- ✅ Distance-based search works
- ✅ Mock city coordinates work (Mumbai, Delhi, Bangalore, etc.)
- ❌ Google Places autocomplete suggestions disabled
- ❌ No dropdown suggestions while typing

## Behavior WITH API Key
- ✅ All above features
- ✅ Real-time location suggestions as you type
- ✅ Address autocomplete with Indian locations
- ✅ Precise geocoding for any location

## Error Prevention
The app now gracefully handles missing API keys:
- No JavaScript errors
- Shows warning notification
- Falls back to manual input
- GPS location still works

## Testing Without API Key
You can test the location search by:
1. Typing city names manually (Mumbai, Delhi, Bangalore, etc.)
2. Using the "Current Location" button
3. Selecting from popular cities
4. The backend will use predefined coordinates for major cities

## Next Steps
1. Get your Google Maps API key from Google Cloud Console
2. Add it to the `.env` file
3. Restart the development server
4. Test autocomplete functionality

---
*Note: The app is fully functional without the API key, but autocomplete suggestions will be disabled.*
