'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  CreditCard,
  DollarSign,
  Download,
  Plus,
  TrendingUp,
  Calendar,
  Wallet,
  CheckCircle,
  Users,
  AlertTriangle,
  Eye,
  Settings,
  ShoppingCart,
  FileText,
  BarChart3,
  Crown,
  Zap,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';

// Import billing components
import MembershipCard from '../../components/billing/MembershipCard';
import SubscriptionStatus from '../../components/billing/SubscriptionStatus';
import UpgradePlanModal from '../../components/billing/UpgradePlanModal';
import CreditBalanceDisplay from '../../components/billing/CreditBalanceDisplay';
import AddCreditsButton from '../../components/billing/AddCreditsButton';
import TransactionHistoryList from '../../components/billing/TransactionHistoryList';
import InvoiceCard from '../../components/billing/InvoiceCard';
import InventoryReorderModal from '../../components/billing/InventoryReorderModal';
import ReorderHistoryTable from '../../components/billing/ReorderHistoryTable';
import PaymentForm from '../../components/billing/PaymentForm';
import PricingConfigForm from '../../components/billing/PricingConfigForm';
import BillingOverview from '../../components/billing/BillingOverview';
import RevenueGraph from '../../components/billing/RevenueGraph';
import UsageByCategoryPieChart from '../../components/billing/UsageByCategoryPieChart';

export default function Billing() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const [showInventoryReorderModal, setShowInventoryReorderModal] = useState(false);
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app this would come from API
  const [billingData, setBillingData] = useState({
    subscription: {
      plan: 'Professional',
      status: 'active',
      nextBilling: '2024-02-15',
      amount: 99,
      currency: 'USD',
      features: ['Unlimited Projects', '100 Hours/Month', 'Priority Support', 'Advanced Analytics']
    },
    credits: {
      balance: 250,
      totalSpent: 1850,
      totalPurchased: 2100
    },
    recentTransactions: [
      {
        id: 'tx-001',
        type: 'subscription',
        amount: 99,
        date: '2024-01-15',
        status: 'completed',
        description: 'Monthly subscription - Professional Plan'
      },
      {
        id: 'tx-002',
        type: 'credits',
        amount: 50,
        date: '2024-01-10',
        status: 'completed',
        description: 'Credit purchase - 50 credits'
      }
    ]
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
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
        <h1 className="text-3xl font-bold">Billing & Payments</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddCreditsModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Credits
          </Button>
        </div>
      </div>

      {/* Billing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.subscription.plan}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={billingData.subscription.status === 'active' ? 'default' : 'destructive'}>
                {billingData.subscription.status}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.credits.balance}</div>
            <p className="text-xs text-muted-foreground">
              Credits available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${billingData.subscription.amount}</div>
            <p className="text-xs text-muted-foreground">
              Due {billingData.subscription.nextBilling}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Billing Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <BillingOverview />
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MembershipCard />
            <SubscriptionStatus />
          </div>
          <Button onClick={() => setShowUpgradePlanModal(true)}>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CreditBalanceDisplay />
            <UsageByCategoryPieChart />
          </div>
          <AddCreditsButton />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionHistoryList />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {billingData.recentTransactions.map((transaction, index) => (
              <InvoiceCard key={transaction.id} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentForm />
            <PricingConfigForm />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showUpgradePlanModal && (
        <UpgradePlanModal onClose={() => setShowUpgradePlanModal(false)} />
      )}
      
      {showInventoryReorderModal && (
        <InventoryReorderModal onClose={() => setShowInventoryReorderModal(false)} />
      )}
    </div>
  );
}