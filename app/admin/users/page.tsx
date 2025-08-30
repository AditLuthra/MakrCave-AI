'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Building2
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'makerspace_admin' | 'service_provider' | 'user';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinDate: string;
  lastActive: string;
  makerspaceId?: string;
  makerspaceName?: string;
  phone?: string;
  profileComplete: boolean;
  projects: number;
  reservations: number;
  certifications: string[];
}

const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Permission check
  const canManageUsers = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  useEffect(() => {
    if (canManageUsers) {
      fetchUsers();
    }
  }, [canManageUsers, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/v1/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setUsers(getMockUsers());
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = (): User[] => [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@makrx.org',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-01-26',
      makerspaceId: 'ms-1',
      makerspaceName: 'TechHub Makerspace',
      phone: '+1 (555) 123-4567',
      profileComplete: true,
      projects: 3,
      reservations: 12,
      certifications: ['3D Printing Safety', 'Laser Safety']
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Designer',
      email: 'sarah@makrx.org',
      role: 'makerspace_admin',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '2024-01-25',
      makerspaceId: 'ms-1',
      makerspaceName: 'TechHub Makerspace',
      phone: '+1 (555) 987-6543',
      profileComplete: true,
      projects: 8,
      reservations: 25,
      certifications: ['3D Printing Safety', 'CNC Operation', 'Electronics']
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Creator',
      email: 'mike@makrx.org',
      role: 'service_provider',
      status: 'active',
      joinDate: '2024-01-05',
      lastActive: '2024-01-26',
      makerspaceId: 'ms-2',
      makerspaceName: 'Austin Makers',
      profileComplete: false,
      projects: 1,
      reservations: 5,
      certifications: ['3D Printing Safety']
    },
    {
      id: '4',
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma@makrx.org',
      role: 'user',
      status: 'pending',
      joinDate: '2024-01-25',
      lastActive: '2024-01-25',
      profileComplete: false,
      projects: 0,
      reservations: 0,
      certifications: []
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Admin',
      email: 'david@makrx.org',
      role: 'admin',
      status: 'active',
      joinDate: '2023-12-01',
      lastActive: '2024-01-26',
      profileComplete: true,
      projects: 0,
      reservations: 0,
      certifications: []
    }
  ];

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/v1/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${action} successful`,
        });
        fetchUsers();
      } else {
        throw new Error(`Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} user`,
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'makerspace_admin': return <Building2 className="h-4 w-4" />;
      case 'service_provider': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'makerspace_admin': return 'bg-green-100 text-green-800';
      case 'service_provider': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'suspended': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.makerspaceName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">You don't have permission to manage users</p>
          <p className="text-sm text-gray-500">Contact your administrator for access</p>
        </div>
      </div>
    );
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage makerspace members and permissions
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'pending').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrators</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => ['super_admin', 'admin', 'makerspace_admin'].includes(u.role)).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="makerspace_admin">Makerspace Admin</SelectItem>
            <SelectItem value="service_provider">Service Provider</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Makerspace</th>
                  <th className="text-left py-3 px-4">Activity</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getRoleColor(user.role)} border flex items-center gap-1 w-fit`}>
                        {getRoleIcon(user.role)}
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(user.status)} border flex items-center gap-1 w-fit`}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {user.makerspaceName ? (
                        <div>
                          <p className="text-sm font-medium">{user.makerspaceName}</p>
                          <p className="text-xs text-muted-foreground">Member</p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p>{user.projects} projects</p>
                        <p className="text-muted-foreground">{user.reservations} reservations</p>
                        <p className="text-xs text-muted-foreground">
                          Last: {new Date(user.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        {user.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'approve')}
                          >
                            Approve
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              No users match your current filters
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}>
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUsers;