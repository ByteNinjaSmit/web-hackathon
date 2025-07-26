# Location-Based Vendor and Product Filtering

This document describes the implementation of location-based vendor and product filtering for the street food marketplace application.

## Overview

The location-based filtering system allows users to find vendors and products near their current location, improving user convenience and scalability. The system uses MongoDB's geospatial queries with 2dsphere indexes for efficient location-based searches.

## Features Implemented

### ✅ Backend Implementation

#### 1. Vendor Schema with GeoJSON
- **File**: `server/database/models/vendor-model.js`
- **Changes**: Updated location field to use proper GeoJSON format
- **Structure**:
  ```javascript
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // longitude
                 v[1] >= -90 && v[1] <= 90;     // latitude
        }
      }
    }
  }
  ```

#### 2. 2dsphere Index
- **File**: `server/database/models/vendor-model.js`
- **Implementation**: Added geospatial index for efficient location queries
- **Code**: `vendorSchema.index({ location: "2dsphere" });`

#### 3. Vendor Controller
- **File**: `server/controllers/vendor-controller.js`
- **Features**:
  - `getNearbyVendors`: Find vendors within specified distance
  - `getVendorsWithProducts`: Get vendors with their products
  - `getAllVendors`: Admin endpoint for all vendors
  - Distance calculation using Haversine formula
  - Product aggregation by vendor

#### 4. Vendor Routes
- **File**: `server/routes/vendor-router.js`
- **Endpoints**:
  - `GET /api/vendors/nearby` - Get nearby vendors
  - `GET /api/vendors/with-products` - Get vendors with products
  - `GET /api/vendors` - Get all vendors (admin)

#### 5. Enhanced Product Controller
- **File**: `server/controllers/product-controller.js`
- **Features**:
  - Location-based product filtering
  - Vendor population with location data
  - Distance calculation for products
  - Fallback to global search when location unavailable

### ✅ Frontend Implementation

#### 1. Location Hook
- **File**: `client/src/hooks/use-location.js`
- **Features**:
  - Browser geolocation API integration
  - Location permission management
  - Local storage persistence
  - Manual location setting
  - Error handling

#### 2. Location API Service
- **File**: `client/src/services/locationApi.js`
- **Features**:
  - Vendor API functions
  - Product API functions
  - Location-based search utilities
  - Distance formatting
  - Coordinate validation

#### 3. Location-Based Search Component
- **File**: `client/src/components/LocationBasedSearch.jsx`
- **Features**:
  - Real-time location detection
  - Search type selection (vendors/products/vendors-with-products)
  - Distance-based filtering
  - Category and text search
  - Results display with distance information

## API Endpoints

### Vendor Endpoints

#### GET /api/vendors/nearby
Find vendors near a specific location.

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `maxDistance` (optional): Maximum distance in meters (default: 10000)
- `limit` (optional): Number of results (default: 20)
- `skip` (optional): Number of results to skip (default: 0)
- `includeProducts` (optional): Include vendor products (default: false)

**Response:**
```json
{
  "success": true,
  "vendors": [
    {
      "_id": "vendor_id",
      "name": "Vendor Name",
      "businessName": "Business Name",
      "location": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "address": {
        "street": "Street Address",
        "city": "City",
        "state": "State"
      },
      "distance": 1500,
      "products": [...],
      "productCount": 5
    }
  ],
  "total": 10,
  "searchLocation": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "maxDistance": 10000
}
```

#### GET /api/vendors/with-products
Get vendors with their products near a location.

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `maxDistance` (optional): Maximum distance in meters (default: 10000)
- `category` (optional): Filter by product category
- `search` (optional): Search in product names
- `limit` (optional): Number of results (default: 20)
- `skip` (optional): Number of results to skip (default: 0)

### Product Endpoints

#### GET /api/products (Enhanced)
Get products with optional location filtering.

**Query Parameters:**
- `latitude` (optional): User's latitude
- `longitude` (optional): User's longitude
- `maxDistance` (optional): Maximum distance in meters (default: 10000)
- `category` (optional): Filter by category
- `search` (optional): Search in product names
- `vendorId` (optional): Filter by specific vendor
- `limit` (optional): Number of results (default: 20)
- `skip` (optional): Number of results to skip (default: 0)

**Response (with location):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "category": "Vegetables",
      "pricePerUnit": 50,
      "unit": "kg",
      "supplierId": {
        "_id": "vendor_id",
        "name": "Vendor Name",
        "businessName": "Business Name",
        "location": {
          "type": "Point",
          "coordinates": [longitude, latitude]
        }
      },
      "distance": 1200
    }
  ],
  "total": 25,
  "searchLocation": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

## Usage Examples

### Client-Side Usage

#### 1. Using the Location Hook
```javascript
import { useLocation } from '../hooks/use-location';

function MyComponent() {
  const { 
    location, 
    loading, 
    error, 
    requestLocation, 
    isLocationAvailable 
  } = useLocation();

  useEffect(() => {
    if (!isLocationAvailable()) {
      requestLocation();
    }
  }, []);

  return (
    <div>
      {loading && <p>Getting location...</p>}
      {error && <p>Error: {error}</p>}
      {location && (
        <p>
          Location: {location.latitude}, {location.longitude}
        </p>
      )}
    </div>
  );
}
```

#### 2. Using Location-Based Search
```javascript
import { locationSearch } from '../services/locationApi';

// Search for nearby vendors
const searchVendors = async () => {
  try {
    const results = await locationSearch.searchVendorsNearby({
      latitude: 12.9716,
      longitude: 77.5946,
      maxDistance: 10000,
      includeProducts: true
    });
    console.log(results.vendors);
  } catch (error) {
    console.error('Search failed:', error);
  }
};

// Search for products near location
const searchProducts = async () => {
  try {
    const results = await locationSearch.searchProductsNearby({
      latitude: 12.9716,
      longitude: 77.5946,
      maxDistance: 10000,
      category: 'Vegetables',
      search: 'tomato'
    });
    console.log(results.products);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

### Server-Side Usage

#### 1. Creating a Vendor with Location
```javascript
const vendor = await Vendor.create({
  name: "John Doe",
  businessName: "Fresh Foods",
  email: "john@example.com",
  location: {
    type: "Point",
    coordinates: [77.5946, 12.9716] // [longitude, latitude]
  },
  address: {
    street: "123 Main St",
    city: "Bangalore",
    state: "Karnataka"
  }
});
```

#### 2. Finding Nearby Vendors
```javascript
const nearbyVendors = await Vendor.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [77.5946, 12.9716]
      },
      $maxDistance: 10000
    }
  }
});
```

## Database Migration

If you have existing vendors with the old location format, you'll need to migrate them:

```javascript
// Migration script
const vendors = await Vendor.find({});
for (const vendor of vendors) {
  if (vendor.location && vendor.location.lat && vendor.location.lng) {
    vendor.location = {
      type: "Point",
      coordinates: [vendor.location.lng, vendor.location.lat]
    };
    await vendor.save();
  }
}
```

## Performance Considerations

1. **Indexing**: The 2dsphere index on the location field ensures efficient geospatial queries
2. **Distance Calculation**: Uses Haversine formula for accurate distance calculation
3. **Pagination**: All endpoints support pagination with limit and skip parameters
4. **Caching**: Consider implementing Redis caching for frequently accessed location data
5. **Query Optimization**: Use compound indexes for queries that filter by both location and other fields

## Security Considerations

1. **Input Validation**: All coordinates are validated for proper ranges
2. **Rate Limiting**: API endpoints are protected by rate limiting
3. **Permission Checks**: Location access requires user consent
4. **Data Sanitization**: All user inputs are sanitized before database queries

## Testing

### Manual Testing
1. Use the `LocationBasedSearch` component to test the full flow
2. Test with different distance ranges
3. Test with and without location permissions
4. Test with various search criteria

### API Testing
```bash
# Test nearby vendors endpoint
curl "http://localhost:5000/api/vendors/nearby?latitude=12.9716&longitude=77.5946&maxDistance=10000"

# Test products with location
curl "http://localhost:5000/api/products?latitude=12.9716&longitude=77.5946&category=Vegetables"
```

## Future Enhancements

1. **Real-time Location Updates**: Implement WebSocket updates for location changes
2. **Advanced Filtering**: Add filters for vendor ratings, product availability, etc.
3. **Location History**: Store user location history for better recommendations
4. **Offline Support**: Cache location data for offline usage
5. **Map Integration**: Integrate with mapping services for visual representation 