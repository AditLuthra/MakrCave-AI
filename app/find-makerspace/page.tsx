'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { MapPin, Clock, Users, Star, Filter, Search, Phone, Mail, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Makerspace {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  hours: {
    weekdays: string;
    weekends: string;
  };
  contact: {
    phone?: string;
    email: string;
    website?: string;
  };
  amenities: string[];
  equipment: string[];
  membershipPlans: {
    name: string;
    price: string;
    features: string[];
  }[];
  rating: number;
  memberCount: number;
  images: string[];
  verified: boolean;
}

export default function FindMakerspacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Mock data for demonstration
  const makerspaces: Makerspace[] = [
    {
      id: 'ms_1',
      name: 'TechMaker Hub',
      description: 'A community-driven makerspace focused on technology innovation and collaborative learning.',
      location: {
        address: '123 Innovation Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      hours: {
        weekdays: '9:00 AM - 10:00 PM',
        weekends: '10:00 AM - 8:00 PM'
      },
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'hello@techmakerhub.com',
        website: 'https://techmakerhub.com'
      },
      amenities: ['WiFi', 'Coffee Bar', 'Parking', '24/7 Access', 'Community Events'],
      equipment: ['3D Printers', 'Laser Cutters', 'Electronics Lab', 'Woodworking', 'Textiles'],
      membershipPlans: [
        {
          name: 'Basic',
          price: '$99/month',
          features: ['Weekday access', 'Basic equipment', 'Community events']
        },
        {
          name: 'Pro',
          price: '$199/month',
          features: ['24/7 access', 'All equipment', 'Storage space', 'Guest passes']
        }
      ],
      rating: 4.8,
      memberCount: 156,
      images: ['/placeholder.svg'],
      verified: true
    },
    {
      id: 'ms_2',
      name: 'Austin Makers Collective',
      description: 'Open community space for makers, artists, and entrepreneurs to create, learn, and collaborate.',
      location: {
        address: '456 Creativity Lane',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        coordinates: { lat: 30.2672, lng: -97.7431 }
      },
      hours: {
        weekdays: '8:00 AM - 11:00 PM',
        weekends: '9:00 AM - 9:00 PM'
      },
      contact: {
        phone: '+1 (555) 987-6543',
        email: 'info@austinmakers.org',
        website: 'https://austinmakers.org'
      },
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Bike Storage', 'Lockers'],
      equipment: ['3D Printers', 'CNC Machines', 'Pottery Studio', 'Photography Studio', 'Metal Shop'],
      membershipPlans: [
        {
          name: 'Student',
          price: '$49/month',
          features: ['Weekday access', 'Basic equipment', 'Workshops']
        },
        {
          name: 'Professional',
          price: '$149/month',
          features: ['Full access', 'All equipment', 'Private storage', 'Meeting rooms']
        }
      ],
      rating: 4.6,
      memberCount: 203,
      images: ['/placeholder.svg'],
      verified: true
    },
    {
      id: 'ms_3',
      name: 'Brooklyn Create Space',
      description: 'A collaborative workspace providing tools and resources for makers of all skill levels.',
      location: {
        address: '789 Maker Avenue',
        city: 'Brooklyn',
        state: 'NY',
        country: 'USA',
        coordinates: { lat: 40.6782, lng: -73.9442 }
      },
      hours: {
        weekdays: '10:00 AM - 9:00 PM',
        weekends: '11:00 AM - 7:00 PM'
      },
      contact: {
        email: 'contact@brooklyncreate.space',
        website: 'https://brooklyncreate.space'
      },
      amenities: ['WiFi', 'Cafe', 'Storage', 'Workshops', 'Gallery Space'],
      equipment: ['3D Printers', 'Sewing Machines', 'Screen Printing', 'Ceramics', 'Digital Fabrication'],
      membershipPlans: [
        {
          name: 'Artist',
          price: '$75/month',
          features: ['Studio access', 'Basic tools', 'Gallery exhibitions']
        },
        {
          name: 'Maker',
          price: '$125/month',
          features: ['Full access', 'All equipment', 'Workshops', 'Storage']
        }
      ],
      rating: 4.4,
      memberCount: 89,
      images: ['/placeholder.svg'],
      verified: false
    }
  ];

  const filterOptions = [
    '3D Printing', 'Laser Cutting', 'Woodworking', 'Electronics', 'Textiles',
    'Ceramics', 'Metal Shop', '24/7 Access', 'Parking', 'Community Events'
  ];

  const filteredMakerspaces = makerspaces.filter(space => {
    const matchesSearch = searchQuery === '' || 
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.location.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.some(filter => 
        space.equipment.some(eq => eq.toLowerCase().includes(filter.toLowerCase())) ||
        space.amenities.some(am => am.toLowerCase().includes(filter.toLowerCase()))
      );

    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Makerspaces</h1>
        <p className="text-xl text-gray-600">
          Discover creative spaces and communities near you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by name, city, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
            >
              Map View
            </Button>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 flex items-center gap-2 mr-2">
            <Filter className="h-4 w-4" />
            Filters:
          </span>
          {filterOptions.map(filter => (
            <Button
              key={filter}
              variant={selectedFilters.includes(filter) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(filter)}
              className="h-8 text-xs"
            >
              {filter}
            </Button>
          ))}
        </div>

        {selectedFilters.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="cursor-pointer" onClick={() => toggleFilter(filter)}>
                {filter} ×
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedFilters([])}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Found {filteredMakerspaces.length} makerspace{filteredMakerspaces.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Makerspaces Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMakerspaces.map((space) => (
            <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Image placeholder</span>
                </div>
                {space.verified && (
                  <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                    Verified
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{space.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {space.location.city}, {space.location.state}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{space.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">
                  {space.description}
                </CardDescription>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Weekdays: {space.hours.weekdays}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{space.memberCount} members</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Equipment:</p>
                  <div className="flex flex-wrap gap-1">
                    {space.equipment.slice(0, 3).map((eq, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {eq}
                      </Badge>
                    ))}
                    {space.equipment.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{space.equipment.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Membership:</p>
                  <div className="text-sm text-gray-600">
                    Starting from {space.membershipPlans[0]?.price}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex gap-2">
                    {space.contact.phone && (
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    {space.contact.website && (
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Link href={`/locations/${space.id}`}>
                    <Button size="sm">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <Card>
          <CardContent className="p-6">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map view coming soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Switch to grid view to explore makerspaces
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {filteredMakerspaces.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No makerspaces found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or removing some filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedFilters([]);
            }}>
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}