'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'inventory' | 'equipment' | 'project' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'destructive';
  }>;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove after 10 seconds for non-urgent notifications
    if (notification.priority !== 'urgent') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate real-time notifications (in real app, this would be WebSocket or SSE)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // Simulate random notifications for demo
      const notificationTypes: NotificationType[] = ['info', 'success', 'warning', 'inventory', 'equipment'];
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      
      if (Math.random() > 0.95) { // 5% chance every 30 seconds
        const messages = {
          info: 'System maintenance scheduled for tonight',
          success: 'Equipment reservation confirmed',
          warning: 'Low inventory alert for 3D printer filament',
          inventory: 'New components added to inventory',
          equipment: 'Laser cutter calibration completed',
        };

        addNotification({
          type: randomType,
          title: 'System Notification',
          message: messages[randomType],
          priority: randomType === 'warning' ? 'high' : 'medium',
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
