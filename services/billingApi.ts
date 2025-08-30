// Billing API types and service for MakrCave
import api from './apiService';

// Type definitions
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  createdAt: string;
  userId: string;
  makerspaceId?: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdAt: string;
  userId: string;
  makerspaceId?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreditWallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface CreditTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
  balanceAfter: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'wallet';
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  userId: string;
}

export interface BillingAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
  period: string;
}

// Billing API service
const billingApi = {
  // Transactions
  getTransactions: async (userId?: string): Promise<Transaction[]> => {
    const endpoint = userId ? `/billing/transactions?userId=${userId}` : '/billing/transactions';
    return api.get(endpoint);
  },

  // Invoices
  getInvoices: async (userId?: string): Promise<Invoice[]> => {
    const endpoint = userId ? `/billing/invoices?userId=${userId}` : '/billing/invoices';
    return api.get(endpoint);
  },

  downloadInvoice: async (invoiceId: string): Promise<Blob> => {
    // Return empty blob for now - this would typically fetch PDF
    return new Blob();
  },

  // Credit wallet
  getCreditWallet: async (userId: string): Promise<CreditWallet | null> => {
    return api.get(`/billing/credit-wallet/${userId}`);
  },

  getCreditTransactions: async (walletId: string): Promise<CreditTransaction[]> => {
    return api.get(`/billing/credit-transactions/${walletId}`);
  },

  // Payment methods
  getPaymentMethods: async (userId: string): Promise<PaymentMethod[]> => {
    return api.get(`/billing/payment-methods/${userId}`);
  },

  // Analytics
  getAnalytics: async (makerspaceId?: string): Promise<BillingAnalytics> => {
    const endpoint = makerspaceId ? `/billing/analytics?makerspaceId=${makerspaceId}` : '/billing/analytics';
    return api.get(endpoint);
  },

  downloadReport: async (type: string, params: any): Promise<Blob> => {
    // Return empty blob for now - this would typically fetch report
    return new Blob();
  },
};

export default billingApi;