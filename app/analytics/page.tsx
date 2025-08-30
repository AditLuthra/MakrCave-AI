'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Wrench,
  CreditCard,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import UsageDashboard from '../../components/analytics/UsageDashboard';
import InventoryInsights from '../../components/analytics/InventoryInsights';
import EquipmentMetrics from '../../components/analytics/EquipmentMetrics';
import ProjectAnalytics from '../../components/analytics/ProjectAnalytics';
import RevenueCharts from '../../components/analytics/RevenueCharts';
import DataExports from '../../components/analytics/DataExports';

interface AnalyticsOverview {
  total_users: number;
  active_users_today: number;
  active_users_week: number;
  total_projects: number;
  active_projects: number;
  total_equipment: number;
  equipment_in_use: number;
  total_inventory_items: number;
  low_stock_items: number;
  total_revenue: number;
  revenue_this_month: number;
}

interface DashboardSection {
  section_id: string;
  title: string;
  charts: Array<{
    title: string;
    data: Array<{
      label: string;
      value: number;
      date?: string;
      metadata?: any;
    }>;
    chart_type: string;
    x_axis_label?: string;
    y_axis_label?: string;
  }>;
  summary_stats?: any;
  last_updated: string;
}

interface AnalyticsDashboard {
  overview: AnalyticsOverview;
  sections: DashboardSection[];
  generated_at: string;
  cache_expires_at: string;
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboard | null>(null);

  // Mock data for development
  useEffect(() => {
    const mockData: AnalyticsDashboard = {
      overview: {
        total_users: 245,
        active_users_today: 42,
        active_users_week: 156,
        total_projects: 89,
        active_projects: 23,
        total_equipment: 34,
        equipment_in_use: 12,
        total_inventory_items: 567,
        low_stock_items: 8,
        total_revenue: 25847,
        revenue_this_month: 3420
      },
      sections: [],
      generated_at: new Date().toISOString(),
      cache_expires_at: new Date(Date.now() + 30*60*1000).toISOString()
    };
    
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview.total_users}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData?.overview.active_users_today} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview.total_projects}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData?.overview.active_projects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview.total_equipment}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData?.overview.equipment_in_use} in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData?.overview.total_revenue}</div>
            <p className="text-xs text-muted-foreground">
              ${analyticsData?.overview.revenue_this_month} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Comprehensive analytics overview will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <UsageDashboard />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryInsights />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentMetrics />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectAnalytics />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueCharts />
        </TabsContent>
      </Tabs>
    </div>
  );
}