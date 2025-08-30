// Health check service for MakrCave
import api from './apiService';

export interface SystemHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  database: 'connected' | 'disconnected' | 'slow';
  api: 'responsive' | 'slow' | 'down';
  services: ServiceHealth[];
  lastChecked: string;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  message?: string;
}

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details?: any;
  timestamp: string;
}

const healthCheckService = {
  getSystemHealth: async (): Promise<SystemHealthStatus> => {
    try {
      return await api.get('/health');
    } catch (error) {
      return {
        overall: 'unhealthy',
        database: 'disconnected',
        api: 'down',
        services: [],
        lastChecked: new Date().toISOString(),
      };
    }
  },

  checkService: async (serviceName: string): Promise<HealthCheckResult> => {
    const startTime = Date.now();
    try {
      await api.get(`/health/${serviceName}`);
      return {
        service: serviceName,
        status: 'healthy',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        service: serviceName,
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        details: error,
        timestamp: new Date().toISOString(),
      };
    }
  },

  monitorHealth: (callback: (health: SystemHealthStatus) => void, interval: number = 30000) => {
    const check = async () => {
      const health = await healthCheckService.getSystemHealth();
      callback(health);
    };

    check(); // Initial check
    const intervalId = setInterval(check, interval);
    
    return () => clearInterval(intervalId); // Return cleanup function
  },
};

export default healthCheckService;