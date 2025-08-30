'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  Package,
  CreditCard,
  Store,
  Save,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

interface MakerspaceSettings {
  id?: string;
  makerspace_id?: string;
  makerspace_name?: string;
  logo_url?: string;
  description?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  operating_hours?: any;
  membership_required?: boolean;
  public_registration?: boolean;
  skill_gated_access?: boolean;
  enable_reservations?: boolean;
  auto_approve_members?: boolean;
  filament_deduction_enabled?: boolean;
  minimum_stock_alerts?: boolean;
  stock_threshold_notification?: boolean;
  allow_personal_consumables?: boolean;
  store_inventory_sync?: boolean;
  default_stock_threshold?: number;
  credit_system_enabled?: boolean;
  show_job_cost_estimates?: boolean;
  default_tax_percent?: number;
  default_currency?: string;
  enable_membership_billing?: boolean;
  service_mode_enabled?: boolean;
  accept_jobs_from_store?: boolean;
  allowed_print_technologies?: string[];
  delivery_radius_km?: number;
  default_service_fee_percent?: number;
  auto_job_assignment?: boolean;
  theme_mode?: string;
  custom_theme_colors?: any;
  landing_page_cta?: string;
  welcome_message?: string;
  enable_chat_widget?: boolean;
  enable_help_widget?: boolean;
  email_notifications_enabled?: boolean;
  sms_notifications_enabled?: boolean;
  push_notifications_enabled?: boolean;
  maintenance_reminder_days?: number;
  require_safety_training?: boolean;
  equipment_access_logging?: boolean;
  visitor_registration_required?: boolean;
  enable_iot_monitoring?: boolean;
  enable_rfid_access?: boolean;
  enable_camera_monitoring?: boolean;
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<MakerspaceSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Check if user has permission to modify settings
  const canModifySettings = user?.role === 'super_admin' || user?.role === 'makerspace_admin';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Mock settings data
      const mockSettings = {
        makerspace_name: 'TechHub Makerspace',
        description: 'A collaborative workspace for makers, engineers, and creators',
        address: '123 Innovation Drive, Tech Park, Bangalore 560001',
        contact_email: 'hello@techhub.com',
        contact_phone: '+91 80 1234 5678',
        timezone: 'Asia/Kolkata',
        membership_required: true,
        public_registration: true,
        skill_gated_access: true,
        enable_reservations: true,
        auto_approve_members: false,
        filament_deduction_enabled: true,
        minimum_stock_alerts: true,
        default_stock_threshold: 10,
        credit_system_enabled: true,
        default_tax_percent: 18,
        default_currency: 'INR',
        enable_membership_billing: true,
        service_mode_enabled: false,
        accept_jobs_from_store: true,
        delivery_radius_km: 25,
        default_service_fee_percent: 15,
        auto_job_assignment: false,
        theme_mode: 'light',
        welcome_message: 'Welcome to TechHub Makerspace! Ready to create something amazing?',
        enable_chat_widget: true,
        enable_help_widget: true,
        email_notifications_enabled: true,
        sms_notifications_enabled: false,
        push_notifications_enabled: true,
        maintenance_reminder_days: 7,
        require_safety_training: true,
        equipment_access_logging: true,
        visitor_registration_required: true,
        enable_iot_monitoring: false,
        enable_rfid_access: false,
        enable_camera_monitoring: false
      };
      
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    if (!canModifySettings) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to modify settings",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/makerspace/settings/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully",
        });
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Makerspace Settings</h1>
          <p className="text-gray-600 mt-1">Configure your makerspace operations and preferences</p>
        </div>
        
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Unsaved changes
            </Badge>
          )}
          <Button 
            onClick={saveSettings} 
            disabled={saving || !canModifySettings}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {!canModifySettings && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800 font-medium">View Only</p>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            You can view settings but don't have permission to modify them. Contact your makerspace admin for changes.
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="makerspace-name">Makerspace Name</Label>
                <Input
                  id="makerspace-name"
                  value={settings.makerspace_name || ''}
                  onChange={(e) => handleSettingChange('makerspace_name', e.target.value)}
                  disabled={!canModifySettings}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={settings.description || ''}
                  onChange={(e) => handleSettingChange('description', e.target.value)}
                  disabled={!canModifySettings}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  rows={2}
                  value={settings.address || ''}
                  onChange={(e) => handleSettingChange('address', e.target.value)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                    disabled={!canModifySettings}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    value={settings.contact_phone || ''}
                    onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
                    disabled={!canModifySettings}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Input
                  id="welcome-message"
                  value={settings.welcome_message || ''}
                  onChange={(e) => handleSettingChange('welcome_message', e.target.value)}
                  disabled={!canModifySettings}
                  placeholder="Welcome message for new users"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Member Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="membership-required">Membership Required</Label>
                  <p className="text-sm text-gray-600">Require membership to access the makerspace</p>
                </div>
                <Switch
                  id="membership-required"
                  checked={settings.membership_required || false}
                  onCheckedChange={(checked) => handleSettingChange('membership_required', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-registration">Public Registration</Label>
                  <p className="text-sm text-gray-600">Allow public user registration</p>
                </div>
                <Switch
                  id="public-registration"
                  checked={settings.public_registration || false}
                  onCheckedChange={(checked) => handleSettingChange('public_registration', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="skill-gated-access">Skill-Gated Equipment Access</Label>
                  <p className="text-sm text-gray-600">Require certifications for equipment access</p>
                </div>
                <Switch
                  id="skill-gated-access"
                  checked={settings.skill_gated_access || false}
                  onCheckedChange={(checked) => handleSettingChange('skill_gated_access', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-approve-members">Auto-approve Members</Label>
                  <p className="text-sm text-gray-600">Automatically approve new member registrations</p>
                </div>
                <Switch
                  id="auto-approve-members"
                  checked={settings.auto_approve_members || false}
                  onCheckedChange={(checked) => handleSettingChange('auto_approve_members', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="visitor-registration">Visitor Registration Required</Label>
                  <p className="text-sm text-gray-600">Require visitors to register before entry</p>
                </div>
                <Switch
                  id="visitor-registration"
                  checked={settings.visitor_registration_required || false}
                  onCheckedChange={(checked) => handleSettingChange('visitor_registration_required', checked)}
                  disabled={!canModifySettings}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="filament-deduction">Filament Auto-deduction</Label>
                  <p className="text-sm text-gray-600">Automatically deduct filament usage from inventory</p>
                </div>
                <Switch
                  id="filament-deduction"
                  checked={settings.filament_deduction_enabled || false}
                  onCheckedChange={(checked) => handleSettingChange('filament_deduction_enabled', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stock-alerts">Minimum Stock Alerts</Label>
                  <p className="text-sm text-gray-600">Send alerts when inventory is running low</p>
                </div>
                <Switch
                  id="stock-alerts"
                  checked={settings.minimum_stock_alerts || false}
                  onCheckedChange={(checked) => handleSettingChange('minimum_stock_alerts', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div>
                <Label htmlFor="stock-threshold">Default Stock Threshold</Label>
                <Input
                  id="stock-threshold"
                  type="number"
                  value={settings.default_stock_threshold || 10}
                  onChange={(e) => handleSettingChange('default_stock_threshold', parseInt(e.target.value))}
                  disabled={!canModifySettings}
                  className="w-32"
                />
                <p className="text-sm text-gray-600 mt-1">Minimum quantity before low stock alert</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="personal-consumables">Allow Personal Consumables</Label>
                  <p className="text-sm text-gray-600">Allow members to bring their own materials</p>
                </div>
                <Switch
                  id="personal-consumables"
                  checked={settings.allow_personal_consumables || false}
                  onCheckedChange={(checked) => handleSettingChange('allow_personal_consumables', checked)}
                  disabled={!canModifySettings}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="credit-system">Credit System</Label>
                  <p className="text-sm text-gray-600">Enable credit-based billing for equipment usage</p>
                </div>
                <Switch
                  id="credit-system"
                  checked={settings.credit_system_enabled || false}
                  onCheckedChange={(checked) => handleSettingChange('credit_system_enabled', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-tax">Default Tax Rate (%)</Label>
                  <Input
                    id="default-tax"
                    type="number"
                    step="0.01"
                    value={settings.default_tax_percent || 0}
                    onChange={(e) => handleSettingChange('default_tax_percent', parseFloat(e.target.value))}
                    disabled={!canModifySettings}
                  />
                </div>
                <div>
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Input
                    id="default-currency"
                    value={settings.default_currency || 'USD'}
                    onChange={(e) => handleSettingChange('default_currency', e.target.value)}
                    disabled={!canModifySettings}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="membership-billing">Membership Billing</Label>
                  <p className="text-sm text-gray-600">Enable recurring membership billing</p>
                </div>
                <Switch
                  id="membership-billing"
                  checked={settings.enable_membership_billing || false}
                  onCheckedChange={(checked) => handleSettingChange('enable_membership_billing', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="service-mode">Service Mode</Label>
                  <p className="text-sm text-gray-600">Accept jobs from external customers</p>
                </div>
                <Switch
                  id="service-mode"
                  checked={settings.service_mode_enabled || false}
                  onCheckedChange={(checked) => handleSettingChange('service_mode_enabled', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              {settings.service_mode_enabled && (
                <div>
                  <Label htmlFor="service-fee">Default Service Fee (%)</Label>
                  <Input
                    id="service-fee"
                    type="number"
                    step="0.01"
                    value={settings.default_service_fee_percent || 0}
                    onChange={(e) => handleSettingChange('default_service_fee_percent', parseFloat(e.target.value))}
                    disabled={!canModifySettings}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-600 mt-1">Service fee percentage for external jobs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="equipment-logging">Equipment Access Logging</Label>
                  <p className="text-sm text-gray-600">Log all equipment access and usage</p>
                </div>
                <Switch
                  id="equipment-logging"
                  checked={settings.equipment_access_logging || false}
                  onCheckedChange={(checked) => handleSettingChange('equipment_access_logging', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="safety-training">Require Safety Training</Label>
                  <p className="text-sm text-gray-600">Require safety training before equipment access</p>
                </div>
                <Switch
                  id="safety-training"
                  checked={settings.require_safety_training || false}
                  onCheckedChange={(checked) => handleSettingChange('require_safety_training', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div>
                <Label htmlFor="maintenance-reminder">Maintenance Reminder (days)</Label>
                <Input
                  id="maintenance-reminder"
                  type="number"
                  value={settings.maintenance_reminder_days || 7}
                  onChange={(e) => handleSettingChange('maintenance_reminder_days', parseInt(e.target.value))}
                  disabled={!canModifySettings}
                  className="w-32"
                />
                <p className="text-sm text-gray-600 mt-1">Days before sending maintenance reminders</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="iot-monitoring">IoT Equipment Monitoring</Label>
                  <p className="text-sm text-gray-600">Enable IoT sensors for equipment monitoring</p>
                </div>
                <Switch
                  id="iot-monitoring"
                  checked={settings.enable_iot_monitoring || false}
                  onCheckedChange={(checked) => handleSettingChange('enable_iot_monitoring', checked)}
                  disabled={!canModifySettings}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rfid-access">RFID Access Control</Label>
                  <p className="text-sm text-gray-600">Enable RFID-based access control</p>
                </div>
                <Switch
                  id="rfid-access"
                  checked={settings.enable_rfid_access || false}
                  onCheckedChange={(checked) => handleSettingChange('enable_rfid_access', checked)}
                  disabled={!canModifySettings}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;