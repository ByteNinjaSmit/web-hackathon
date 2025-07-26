const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test coordinates (Bangalore, India)
const TEST_COORDS = {
  latitude: 12.9716,
  longitude: 77.5946
};

async function testLocationAPI() {
  console.log('🧪 Testing Location-Based API Endpoints\n');

  try {
    // Test 1: Get nearby vendors
    console.log('1. Testing GET /api/vendors/nearby');
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/nearby`, {
        params: {
          latitude: TEST_COORDS.latitude,
          longitude: TEST_COORDS.longitude,
          maxDistance: 10000,
          limit: 5
        }
      });
      console.log('✅ Success:', response.data.success);
      console.log('📊 Found vendors:', response.data.total);
      console.log('📍 Search location:', response.data.searchLocation);
      console.log('');
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
      console.log('');
    }

    // Test 2: Get vendors with products
    console.log('2. Testing GET /api/vendors/with-products');
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/with-products`, {
        params: {
          latitude: TEST_COORDS.latitude,
          longitude: TEST_COORDS.longitude,
          maxDistance: 10000,
          limit: 5
        }
      });
      console.log('✅ Success:', response.data.success);
      console.log('📊 Found vendors with products:', response.data.total);
      console.log('');
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
      console.log('');
    }

    // Test 3: Get products with location filtering
    console.log('3. Testing GET /api/products (with location)');
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          latitude: TEST_COORDS.latitude,
          longitude: TEST_COORDS.longitude,
          maxDistance: 10000,
          limit: 5
        }
      });
      console.log('✅ Success:', response.data.success);
      console.log('📊 Found products:', response.data.total);
      console.log('📍 Search location:', response.data.searchLocation);
      console.log('');
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
      console.log('');
    }

    // Test 4: Get products by category with location
    console.log('4. Testing GET /api/products (with category filter)');
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          latitude: TEST_COORDS.latitude,
          longitude: TEST_COORDS.longitude,
          maxDistance: 10000,
          category: 'Vegetables',
          limit: 5
        }
      });
      console.log('✅ Success:', response.data.success);
      console.log('📊 Found vegetables:', response.data.total);
      console.log('');
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
      console.log('');
    }

    // Test 5: Test without location (should still work)
    console.log('5. Testing GET /api/products (without location)');
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          limit: 5
        }
      });
      console.log('✅ Success:', response.data.success);
      console.log('📊 Found products (global):', response.data.total);
      console.log('📍 Search location:', response.data.searchLocation);
      console.log('');
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
      console.log('');
    }

    // Test 6: Test invalid coordinates
    console.log('6. Testing with invalid coordinates');
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/nearby`, {
        params: {
          latitude: 'invalid',
          longitude: 'invalid',
          maxDistance: 10000
        }
      });
      console.log('❌ Should have failed with invalid coordinates');
    } catch (error) {
      console.log('✅ Correctly rejected invalid coordinates:', error.response?.data?.message);
      console.log('');
    }

    console.log('🎉 Location-based API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testLocationAPI(); 