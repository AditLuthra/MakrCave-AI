'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Layers,
  Zap,
  Users,
  Star,
  Phone,
  Mail,
  Globe,
  ArrowRight
} from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  type: 'makerspace' | 'fablab' | 'community_workshop' | 'university_lab';
  coordinates: { lat: number; lng: number };
  address: string;
  city: string;
  country: string;
  rating: number;
  memberCount: number;
  verified: boolean;
  amenities: string[];
  equipment: string[];
  contact: {
    phone?: string;
    email: string;
    website?: string;
  };
  distance?: number; // in km
}

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapMode, setMapMode] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  useEffect(() => {
    fetchLocations();
    getUserLocation();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/v1/locations/map', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        setLocations(getMockLocations());
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations(getMockLocations());
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to San Francisco
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  };

  const getMockLocations = (): MapLocation[] => [
    {
      id: 'loc-1',
      name: 'TechMaker Hub',
      type: 'makerspace',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      address: '123 Innovation Street',
      city: 'San Francisco',
      country: 'USA',
      rating: 4.8,
      memberCount: 156,
      verified: true,
      amenities: ['WiFi', 'Coffee Bar', 'Parking', '24/7 Access'],
      equipment: ['3D Printers', 'Laser Cutters', 'Electronics Lab'],
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'hello@techmakerhub.com',
        website: 'https://techmakerhub.com'
      },
      distance: 0.5
    },
    {
      id: 'loc-2',
      name: 'Austin Makers Collective',
      type: 'community_workshop',
      coordinates: { lat: 30.2672, lng: -97.7431 },
      address: '456 Creativity Lane',
      city: 'Austin',
      country: 'USA',
      rating: 4.6,
      memberCount: 203,
      verified: true,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Bike Storage'],
      equipment: ['3D Printers', 'CNC Machines', 'Pottery Studio'],
      contact: {
        email: 'info@austinmakers.org',
        website: 'https://austinmakers.org'
      },
      distance: 1200
    },
    {
      id: 'loc-3',
      name: 'Brooklyn Create Space',
      type: 'fablab',
      coordinates: { lat: 40.6782, lng: -73.9442 },
      address: '789 Maker Avenue',
      city: 'Brooklyn',
      country: 'USA',
      rating: 4.4,
      memberCount: 89,
      verified: false,
      amenities: ['WiFi', 'Cafe', 'Storage'],
      equipment: ['3D Printers', 'Sewing Machines', 'Screen Printing'],
      contact: {
        email: 'contact@brooklyncreate.space',
        website: 'https://brooklyncreate.space'
      },
      distance: 2800
    },
    {
      id: 'loc-4',
      name: 'MIT FabLab',
      type: 'university_lab',
      coordinates: { lat: 42.3601, lng: -71.0942 },
      address: 'Massachusetts Institute of Technology',
      city: 'Cambridge',
      country: 'USA',
      rating: 4.9,
      memberCount: 45,
      verified: true,
      amenities: ['University Access', 'Research Facilities'],
      equipment: ['Advanced 3D Printers', 'Precision CNC', 'PCB Manufacturing'],
      contact: {
        email: 'fablab@mit.edu',
        website: 'https://www.fablabs.io/labs/fablabmit'
      },
      distance: 4200
    }
  ];

  const typeColors = {
    makerspace: 'bg-blue-100 text-blue-800',
    fablab: 'bg-green-100 text-green-800',
    community_workshop: 'bg-purple-100 text-purple-800',
    university_lab: 'bg-yellow-100 text-yellow-800'
  };

  const typeIcons = {
    makerspace: '🔧',
    fablab: '⚙️',
    community_workshop: '🏗️',
    university_lab: '🎓'
  };

  const filterOptions = [
    '3D Printing', 'Laser Cutting', 'CNC Machines', 'Electronics', 
    'Woodworking', 'Textiles', 'Ceramics', 'Metal Shop',
    'WiFi', 'Parking', '24/7 Access', 'Community Events'
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = searchQuery === '' || 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.some(filter => 
        location.equipment.some(eq => eq.toLowerCase().includes(filter.toLowerCase())) ||
        location.amenities.some(am => am.toLowerCase().includes(filter.toLowerCase()))
      );

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interactive Map</h1>
          <p className="text-gray-600 mt-1">
            Discover makerspaces and creative communities near you
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            My Location
          </Button>
          <Button variant="outline" size="sm">
            <Layers className="h-4 w-4 mr-2" />
            Map Type
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(filter => (
                  <Button
                    key={filter}
                    variant={selectedFilters.includes(filter) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleFilter(filter)}
                    className="h-7 text-xs"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Location Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(typeColors).map(([type, colorClass]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className="text-lg">{typeIcons[type as keyof typeof typeIcons]}</span>
                  <Badge variant="outline" className={colorClass}>
                    {type.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    ({locations.filter(l => l.type === type).length})
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Results List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Results ({filteredLocations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {filteredLocations.map(location => (
                <div
                  key={location.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLocation?.id === location.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{location.name}</h4>
                      <p className="text-xs text-gray-600">
                        {location.city}, {location.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{location.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`text-xs ${typeColors[location.type]}`}>
                      {location.type.replace('_', ' ')}
                    </Badge>
                    {location.distance && (
                      <span className="text-xs text-gray-500">
                        {location.distance < 10 
                          ? `${location.distance.toFixed(1)} km` 
                          : `${Math.round(location.distance)} km`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              <div className="h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative">
                {/* Map Placeholder */}
                <div className="text-center z-10">
                  <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
                  <p className="text-gray-600 mb-4">
                    Full map integration coming soon
                  </p>
                  <p className="text-sm text-gray-500">
                    Showing {filteredLocations.length} locations in your area
                  </p>
                </div>

                {/* Mock Location Pins */}
                <div className="absolute inset-0 p-8">
                  {filteredLocations.slice(0, 4).map((location, index) => (
                    <div
                      key={location.id}
                      className={`absolute w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-lg hover:bg-blue-700 transition-colors ${
                        selectedLocation?.id === location.id ? 'ring-4 ring-blue-300' : ''
                      }`}
                      style={{
                        left: `${20 + index * 20}%`,
                        top: `${30 + index * 15}%`,
                      }}
                      onClick={() => setSelectedLocation(location)}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="bg-white">
                    <Zap className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Location Details */}
          {selectedLocation && (
            <Card className="mt-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">{typeIcons[selectedLocation.type]}</span>
                      {selectedLocation.name}
                      {selectedLocation.verified && (
                        <Badge className="bg-green-600 text-white">Verified</Badge>
                      )}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedLocation.address}, {selectedLocation.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{selectedLocation.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Equipment</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedLocation.equipment.slice(0, 3).map((eq, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {eq}
                        </Badge>
                      ))}
                      {selectedLocation.equipment.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{selectedLocation.equipment.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedLocation.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    {selectedLocation.contact.phone && (
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    {selectedLocation.contact.website && (
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Button>
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;