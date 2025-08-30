# Services Layer

## Overview
The services directory contains the API service layer that handles communication between the frontend and backend, as well as external service integrations.

## Service Files

### Core API Services

#### `apiService.ts`
Main API communication service:
- HTTP client configuration
- Request/response interceptors
- Error handling and retry logic
- Authentication token management
- Base URL and endpoint management

#### `billingApi.ts` & `billingService.ts`
Billing and payment services:
- Payment processing integration
- Subscription management
- Invoice generation
- Credit balance tracking
- Transaction history

#### `healthCheckService.ts`
System health monitoring:
- Service availability checks
- Performance metric collection
- Error rate monitoring
- Uptime tracking

### Utility Services

#### `fileUploadService.ts`
File management service:
- Secure file uploads
- Progress tracking
- File type validation
- Size limit enforcement
- Cloud storage integration

#### `loggingService.ts`
Centralized logging:
- Structured log formatting
- Log level management
- Error reporting
- Performance tracking
- Debug information

### Backend Services (Python)

#### `keycloak_client.py`
Authentication service integration:
- Keycloak API communication
- User management
- Role synchronization
- Token validation

#### `real_analytics_service.py`
Analytics data processing:
- Usage metrics collection
- Report generation
- Data aggregation
- Performance analytics

## Usage Patterns

### API Service Usage
```typescript
import { apiService } from '@/services/apiService';

// GET request
const data = await apiService.get('/api/equipment');

// POST request with data
const newItem = await apiService.post('/api/inventory', {
  name: 'New Item',
  quantity: 10
});

// PUT request for updates
const updated = await apiService.put('/api/members/123', memberData);
```

### File Upload Usage
```typescript
import { fileUploadService } from '@/services/fileUploadService';

const handleUpload = async (file: File) => {
  try {
    const result = await fileUploadService.upload(file, {
      onProgress: (progress) => setUploadProgress(progress),
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/*', 'application/pdf']
    });
    
    console.log('Upload complete:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Health Check Usage
```typescript
import { healthCheckService } from '@/services/healthCheckService';

const checkSystemHealth = async () => {
  const health = await healthCheckService.getSystemHealth();
  
  if (health.status === 'unhealthy') {
    // Handle system issues
    showNotification('System maintenance in progress', 'warning');
  }
};
```

## Error Handling

### Standard Error Response
```typescript
interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}
```

### Error Handling Patterns
```typescript
try {
  const data = await apiService.get('/api/data');
  return data;
} catch (error) {
  if (error.status === 401) {
    // Handle authentication error
    redirectToLogin();
  } else if (error.status >= 500) {
    // Handle server error
    showNotification('Server error, please try again', 'error');
  } else {
    // Handle other errors
    showNotification(error.message, 'error');
  }
  
  throw error; // Re-throw for component handling
}
```

## Configuration

### Environment Variables
Services use environment variables for configuration:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL
- `NEXT_PUBLIC_UPLOAD_MAX_SIZE` - Maximum file upload size
- `NEXT_PUBLIC_LOG_LEVEL` - Logging level

### Service Configuration
```typescript
// apiService.ts
const config = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};
```

## Testing Services

### Mock Services for Testing
```typescript
// __mocks__/apiService.ts
export const apiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};
```

### Service Testing
```typescript
import { apiService } from '@/services/apiService';
import { mockApiResponse } from '@/test-utils';

describe('API Service', () => {
  test('should fetch data correctly', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApiResponse(mockData);
    
    const result = await apiService.get('/api/test');
    expect(result).toEqual(mockData);
  });
});
```

## Performance Optimization

### Request Caching
Services implement intelligent caching:
- GET request caching with TTL
- Cache invalidation strategies
- Background refresh for stale data

### Request Batching
Multiple requests can be batched:
```typescript
const batchRequests = await Promise.all([
  apiService.get('/api/equipment'),
  apiService.get('/api/inventory'),
  apiService.get('/api/members')
]);
```

### Retry Logic
Automatic retry for failed requests:
- Exponential backoff
- Maximum retry limits
- Circuit breaker pattern

## Security

### Authentication
All API requests include authentication tokens:
- JWT token in Authorization header
- Automatic token refresh
- Secure token storage

### Data Validation
Input validation on all requests:
- Schema validation
- Sanitization of user input
- Type checking

## Monitoring

### Request Logging
All service requests are logged:
- Request/response logging
- Error tracking
- Performance metrics

### Analytics
Service usage analytics:
- API endpoint usage
- Error rates
- Response times
- User behavior tracking