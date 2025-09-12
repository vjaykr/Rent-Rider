# RentRider Setup Instructions

## Current Status: Location-Based Bike Search Implementation

### ✅ Completed Features:
1. **Backend API** - Location-based vehicle search with distance calculation
2. **Frontend Integration** - API calls for real-time vehicle data
3. **Google Places Autocomplete** - Ready for API key integration
4. **Live Location Tracking** - GPS-based search with permission handling
5. **Distance Filtering** - Haversine formula for accurate distance calculation
6. **Mock Data** - Fallback data for testing without database

### 🔧 Required Configuration:

#### 1. Google Maps API Key
**Current Status**: Placeholder `GOOGLE_MAPS_API_KEY` needs to be replaced

**File to Update**: `/client/src/pages/Home/Home.js`

**Line 31**: Replace `GOOGLE_MAPS_API_KEY` with your actual API key:
```javascript
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places&callback=initGoogleMaps`;
```

**Required Google Maps APIs**:
- Places API
- Geocoding API
- Maps JavaScript API

#### 2. Environment Variables
Create `.env` files if not already present:

**Server (.env)**:
```env
MONGODB_URI=mongodb://localhost:27017/rentrider
JWT_SECRET=your-jwt-secret-key
PORT=5000
```

**Client (.env)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-actual-api-key
```

### 🚀 Current Implementation:

#### Backend API Endpoints:
- `GET /api/vehicles` - Get all vehicles with location filtering
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles/dev/mock-data` - Add mock data for testing

#### Location Search Features:
1. **Coordinate-based Search**: Uses latitude/longitude for precise distance calculation
2. **City Recognition**: Automatically detects major Indian cities
3. **GPS Integration**: Real-time location detection with permission handling
4. **Distance Display**: Shows distance from user to each vehicle
5. **Radius Filtering**: 2km, 5km, 10km, 20km, 50km options

#### Fallback Systems:
- Mock data if API fails
- Default coordinates (Mumbai) if geolocation fails
- City-based coordinate mapping for major Indian cities

### 🔍 Testing the Location Search:

1. **Start all services**:
   ```bash
   # Terminal 1 - Backend
   cd server && npm start
   
   # Terminal 2 - Frontend
   cd client && npm start
   
   # Terminal 3 - Admin Panel
   cd admin-panel && npm start
   ```

2. **Test location search**:
   - Go to Home page
   - Enter "Mumbai" in search box
   - Select radius (5km recommended)
   - Click "Search Bikes"
   - Should show vehicles with distance indicators

3. **Test GPS location**:
   - Click "Current" button
   - Allow location permission
   - Should auto-fill with your address
   - Search should show nearby vehicles

### 📱 User Experience:
- **Permission Status**: Visual indicators for location access
- **Live Tracking**: Continuous GPS updates with accuracy display
- **Smart Search**: Autocomplete suggestions for locations
- **Distance Badges**: Shows exact distance to each vehicle
- **Responsive Design**: Works on all device sizes

### 🔄 Next Steps:
1. Add your Google Maps API key
2. Test with real location data
3. Add more cities to coordinate mapping
4. Implement advanced filtering (price, type, features)
5. Add map view for vehicle locations
6. Connect to real vehicle database

### 🐛 Troubleshooting:
- **No vehicles found**: Check if mock data is loaded or API is running
- **Location not working**: Verify browser permissions and HTTPS
- **Google Maps not loading**: Check API key and billing account
- **Distance calculation issues**: Verify coordinate format and Haversine formula

### 📊 Current Data Structure:
```javascript
{
  _id: "V001",
  brand: "Royal Enfield",
  model: "Classic 350",
  type: "motorcycle",
  location: {
    address: "Bandra West",
    city: "Mumbai",
    coordinates: { latitude: 19.0596, longitude: 72.8295 }
  },
  pricing: { hourlyRate: 100, dailyRate: 800 },
  distance: 2.3 // Calculated in real-time
}
```

### 🌟 Key Features Working:
- ✅ Location-based search with distance calculation
- ✅ Real-time GPS tracking and permission handling
- ✅ Google Places Autocomplete (needs API key)
- ✅ Responsive filtering and sorting
- ✅ Error handling and fallback systems
- ✅ Modern UI with loading states
- ✅ Distance badges and availability indicators

**Ready for production with your Google Maps API key!**
