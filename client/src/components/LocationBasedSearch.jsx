import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/auth';
import { useLocation } from '../hooks/use-location';
import { locationSearch, locationUtils } from '../services/locationApi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { MapPin, Search, Package, Store, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LocationBasedSearch = () => {
  const { isLoggedIn, user } = useAuth();
  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  
  const [searchType, setSearchType] = useState('vendors');
  const [maxDistance, setMaxDistance] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'spices', name: 'Spices' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'oils', name: 'Oils' },
    { id: 'grains', name: 'Grains' }
  ];

  const handleSearch = async () => {
    if (!location) {
      toast.error('Location is required for search');
      return;
    }

    setLoading(true);
    try {
      let data;
      
      if (searchType === 'vendors') {
        data = await locationSearch.searchVendorsNearby({
          latitude: location.latitude,
          longitude: location.longitude,
          maxDistance,
          search: search || undefined,
          category: category !== 'all' ? category : undefined
        });
        setResults(data.vendors || []);
      } else {
        data = await locationSearch.searchProductsNearby({
          latitude: location.latitude,
          longitude: location.longitude,
          maxDistance,
          search: search || undefined,
          category: category !== 'all' ? category : undefined
        });
        setResults(data.products || []);
      }
      
      toast.success(`Found ${results.length} ${searchType}`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = async () => {
    try {
      await requestLocation();
      toast.success('Location access granted!');
    } catch (error) {
      toast.error('Location access denied. Please enable location services.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location-Based Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                {locationLoading ? 'Getting location...' : 
                 locationError ? 'Location error' :
                 location ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` :
                 'Location not available'}
              </span>
            </div>
            {!location && !locationLoading && (
              <Button onClick={handleLocationRequest} size="sm">
                Enable Location
              </Button>
            )}
          </div>

          {/* Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Type</label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendors">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Vendors
                    </div>
                  </SelectItem>
                  <SelectItem value="products">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Products
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Max Distance</label>
              <Select value={maxDistance.toString()} onValueChange={(value) => setMaxDistance(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="20">20 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Search Term</label>
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={!location || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search {searchType}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Results ({results.length} {searchType} found)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item, index) => (
                <Card key={item._id || index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {searchType === 'vendors' 
                            ? (item.businessName || item.name || 'Unnamed Vendor')
                            : item.name
                          }
                        </h4>
                        <p className="text-sm text-gray-600">
                          {searchType === 'vendors' 
                            ? item.category 
                            : item.category
                          }
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {locationUtils.formatDistance(item.distance)}
                      </Badge>
                    </div>
                    
                    {searchType === 'vendors' ? (
                      <div className="space-y-2">
                        {item.address && (
                          <p className="text-xs text-gray-500">{item.address}</p>
                        )}
                        {item.phone && (
                          <p className="text-xs text-gray-500">📞 {item.phone}</p>
                        )}
                        {item.products && item.products.length > 0 && (
                          <p className="text-xs text-purple-600">
                            {item.products.length} products available
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-bold text-purple-600">
                          ₹{item.price}
                        </p>
                        {item.supplierId && (
                          <p className="text-xs text-gray-500">
                            By: {item.supplierId.businessName || item.supplierId.name}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {results.length === 0 && !loading && location && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {searchType} found nearby
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or increasing the distance
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationBasedSearch; 