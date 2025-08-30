'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Calendar,
  Clock,
  User,
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

interface Reservation {
  id: string;
  equipment_id: string;
  equipment_name: string;
  user_id: string;
  user_name: string;
  user_email: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'in_use' | 'maintenance' | 'offline';
  hourly_rate: number;
  location: string;
  requires_certification: boolean;
}

const Reservations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('my-reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Permission checks
  const canViewAllReservations = user?.role === 'super_admin' || user?.role === 'makerspace_admin';
  const canCreateReservation = user?.role !== 'admin';

  useEffect(() => {
    fetchReservations();
    fetchEquipment();
  }, [activeTab, statusFilter, dateFilter]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'my-reservations' 
        ? '/api/v1/reservations/user'
        : '/api/v1/reservations';
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter !== 'all') params.append('date_filter', dateFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        // Use mock data
        setReservations(getMockReservations());
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations(getMockReservations());
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/v1/equipment/available', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
      } else {
        setEquipment(getMockEquipment());
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setEquipment(getMockEquipment());
    }
  };

  const getMockReservations = (): Reservation[] => [
    {
      id: 'res-1',
      equipment_id: 'eq-1',
      equipment_name: 'Ultimaker S3 3D Printer',
      user_id: user?.id || 'user-1',
      user_name: user?.firstName + ' ' + user?.lastName || 'John Doe',
      user_email: user?.email || 'john@example.com',
      start_time: '2024-01-28T10:00:00Z',
      end_time: '2024-01-28T14:00:00Z',
      duration_hours: 4,
      status: 'confirmed',
      cost: 100.00,
      notes: 'Prototyping session for new project',
      created_at: '2024-01-26T15:30:00Z',
      updated_at: '2024-01-26T15:30:00Z'
    },
    {
      id: 'res-2',
      equipment_id: 'eq-2',
      equipment_name: 'Glowforge Pro Laser Cutter',
      user_id: 'user-2',
      user_name: 'Sarah Wilson',
      user_email: 'sarah@example.com',
      start_time: '2024-01-28T16:00:00Z',
      end_time: '2024-01-28T18:00:00Z',
      duration_hours: 2,
      status: 'pending',
      cost: 70.00,
      notes: 'Cutting acrylic panels',
      created_at: '2024-01-27T09:15:00Z',
      updated_at: '2024-01-27T09:15:00Z'
    },
    {
      id: 'res-3',
      equipment_id: 'eq-3',
      equipment_name: 'CNC Machine Shapeoko 4',
      user_id: user?.id || 'user-1',
      user_name: user?.firstName + ' ' + user?.lastName || 'John Doe',
      user_email: user?.email || 'john@example.com',
      start_time: '2024-01-25T13:00:00Z',
      end_time: '2024-01-25T17:00:00Z',
      duration_hours: 4,
      status: 'completed',
      cost: 180.00,
      notes: 'Wood cutting for cabinet project',
      created_at: '2024-01-24T11:20:00Z',
      updated_at: '2024-01-25T17:30:00Z'
    }
  ];

  const getMockEquipment = (): Equipment[] => [
    {
      id: 'eq-1',
      name: 'Ultimaker S3 3D Printer',
      category: '3D Printer',
      status: 'available',
      hourly_rate: 25.00,
      location: 'Station A1',
      requires_certification: true
    },
    {
      id: 'eq-2',
      name: 'Glowforge Pro Laser Cutter',
      category: 'Laser Cutter',
      status: 'available',
      hourly_rate: 35.00,
      location: 'Station B1',
      requires_certification: true
    },
    {
      id: 'eq-3',
      name: 'CNC Machine Shapeoko 4',
      category: 'CNC Machine',
      status: 'maintenance',
      hourly_rate: 45.00,
      location: 'Station C1',
      requires_certification: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleReservationAction = async (reservationId: string, action: string) => {
    try {
      const response = await fetch(`/api/v1/reservations/${reservationId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Reservation ${action} successful`,
        });
        fetchReservations(); // Refresh the list
      } else {
        throw new Error(`Failed to ${action} reservation`);
      }
    } catch (error) {
      console.error(`Error ${action} reservation:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} reservation`,
        variant: "destructive",
      });
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = searchTerm === '' || 
      reservation.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Reservations</h1>
          <p className="text-gray-600 mt-1">
            Manage and track equipment bookings
          </p>
        </div>
        
        {canCreateReservation && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-reservations">My Reservations</TabsTrigger>
          {canViewAllReservations && (
            <TabsTrigger value="all-reservations">All Reservations</TabsTrigger>
          )}
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="my-reservations" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reservations List */}
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{reservation.equipment_name}</h3>
                        <Badge className={getStatusColor(reservation.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(reservation.status)}
                            <span className="capitalize">{reservation.status}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(reservation.start_time).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(reservation.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          <span>{reservation.duration_hours} hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${reservation.cost.toFixed(2)}</span>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            <strong>Notes:</strong> {reservation.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {reservation.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReservationAction(reservation.id, 'cancel')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {reservation.status === 'confirmed' && (
                        <Button 
                          size="sm"
                          onClick={() => handleReservationAction(reservation.id, 'start')}
                        >
                          Start Session
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredReservations.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'my-reservations' 
                      ? "You don't have any reservations yet." 
                      : "No reservations match your current filters."}
                  </p>
                  {canCreateReservation && (
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Make Your First Reservation
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {canViewAllReservations && (
          <TabsContent value="all-reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Reservations Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive reservation management interface for administrators.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Calendar integration coming soon</p>
                  <p className="text-sm text-gray-500 mt-2">
                    View and manage reservations in a calendar format
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reservations;