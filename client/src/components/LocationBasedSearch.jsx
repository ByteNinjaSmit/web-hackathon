import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/use-location';
import { locationSearch, locationUtils } from '../services/locationApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, MapPin, Search, Package, Store } from 'lucide-react';

const LocationBasedSearch = () => {
  const { location, loading, error, requestLocation, isLocationAvailable } = useLocation();
  const [searchType, setSearchType] = useState('vendors'); // 'vendors' or 'products'
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    category: '',
    search: '',
    maxDistance: 10000,
  });

  // Auto-request location on component mount
  useEffect(() => {
    if (!isLocationAvailable()) {
      requestLocation().catch(console.error);
    }
  }, [isLocationAvailable, requestLocation]);

  // Handle search
  const handleSearch = async () => {
    if (!isLocationAvailable()) {
      setSearchError('Location is required for search');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        maxDistance: searchParams.maxDistance,
        limit: 20,
      };

      if (searchParams.category) {
        params.category = searchParams.category;
      }

      if (searchParams.search) {
        params.search = searchParams.search;
      }

      let results;
      if (searchType === 'vendors') {
        results = await locationSearch.searchVendorsNearby(params);
        setSearchResults(results.vendors || []);
      } else {
        results = await locationSearch.searchProductsNearby(params);
        setSearchResults(results.products || []);
      }
    } catch (error) {
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search with products
  const handleSearchWithProducts = async () => {
    if (!isLocationAvailable()) {
      setSearchError('Location is required for search');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        maxDistance: searchParams.maxDistance,
        limit: 20,
      };

      if (searchParams.category) {
        params.category = searchParams.category;
      }

      if (searchParams.search) {
        params.search = searchParams.search;
      }

      const results = await locationSearch.getVendorsWithProductsNearby(params);
      setSearchResults(results.vendors || []);
    } catch (error) {
      setSearchError(error.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const renderVendorCard = (vendor) => (
    <Card key={vendor._id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{vendor.businessName || vendor.name}</CardTitle>
            <CardDescription>{vendor.email}</CardDescription>
          </div>
          {vendor.distance && (
            <Badge variant="secondary">
              <MapPin className="w-3 h-3 mr-1" />
              {locationUtils.formatDistance(vendor.distance)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {vendor.address && (
          <p className="text-sm text-gray-600 mb-2">
            {vendor.address.street}, {vendor.address.city}, {vendor.address.state}
          </p>
        )}
        {vendor.productCount !== undefined && (
          <div className="flex items-center text-sm text-gray-500">
            <Package className="w-4 h-4 mr-1" />
            {vendor.productCount} products available
          </div>
        )}
        {vendor.products && vendor.products.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-2">Available Products:</h4>
            <div className="space-y-1">
              {vendor.products.slice(0, 3).map((product) => (
                <div key={product._id} className="flex justify-between text-sm">
                  <span>{product.name}</span>
                  <span className="text-gray-500">₹{product.pricePerUnit}/{product.unit}</span>
                </div>
              ))}
              {vendor.products.length > 3 && (
                <p className="text-xs text-gray-500">+{vendor.products.length - 3} more products</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderProductCard = (product) => (
    <Card key={product._id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription>{product.category}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">₹{product.pricePerUnit}</div>
            <div className="text-sm text-gray-500">per {product.unit}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">{product.category}</Badge>
          {product.distance && (
            <Badge variant="secondary">
              <MapPin className="w-3 h-3 mr-1" />
              {locationUtils.formatDistance(product.distance)}
            </Badge>
          )}
        </div>
        {product.supplierId && (
          <div className="flex items-center text-sm text-gray-600">
            <Store className="w-4 h-4 mr-1" />
            {product.supplierId.businessName || product.supplierId.name}
          </div>
        )}
        {product.description && (
          <p className="text-sm text-gray-600 mt-2">{product.description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Location-Based Search</h1>
        <p className="text-gray-600">
          Find vendors and products near your location
        </p>
      </div>

      {/* Location Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting your location...
            </div>
          )}
          {error && (
            <Alert className="mb-4">
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={requestLocation}
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {location && (
            <div className="text-sm">
              <p><strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
              {location.accuracy && (
                <p><strong>Accuracy:</strong> ±{Math.round(location.accuracy)}m</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Type</label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendors">Vendors</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="vendors-with-products">Vendors with Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Max Distance</label>
              <Select 
                value={searchParams.maxDistance.toString()} 
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, maxDistance: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">5 km</SelectItem>
                  <SelectItem value="10000">10 km</SelectItem>
                  <SelectItem value="20000">20 km</SelectItem>
                  <SelectItem value="50000">50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Term</label>
              <Input
                placeholder="Search for products or vendors..."
                value={searchParams.search}
                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select 
                value={searchParams.category} 
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Spices">Spices</SelectItem>
                  <SelectItem value="Condiments">Condiments</SelectItem>
                  <SelectItem value="Meat">Meat</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={searchType === 'vendors-with-products' ? handleSearchWithProducts : handleSearch}
              disabled={!isLocationAvailable() || searchLoading}
              className="flex-1"
            >
              {searchLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchError && (
        <Alert className="mb-6">
          <AlertDescription>{searchError}</AlertDescription>
        </Alert>
      )}

      {searchResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Search Results ({searchResults.length})
          </h2>
          <div className="space-y-4">
            {searchResults.map((item) => 
              searchType === 'products' ? renderProductCard(item) : renderVendorCard(item)
            )}
          </div>
        </div>
      )}

      {!searchLoading && searchResults.length === 0 && !searchError && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No results found. Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationBasedSearch; 