# React Contexts

## Overview
This directory contains React Context providers that manage global state and shared functionality across the MakrCave application.

## Context Providers

### Authentication (`AuthContext.tsx`)
Manages user authentication state and operations:
- User login/logout
- Token management
- Authentication status
- User profile data
- Role-based permissions

```tsx
const { user, login, logout, isAuthenticated } = useAuth();
```

### Portal Authentication (`PortalAuthContext.tsx`)
Specialized authentication for the makerspace portal:
- Portal-specific user data
- Makerspace-scoped permissions
- Portal navigation state

### Billing (`BillingContext.tsx`)
Handles billing and payment-related state:
- Credit balance tracking
- Payment methods
- Transaction history
- Subscription status
- Usage tracking

```tsx
const { balance, addCredits, transactions } = useBilling();
```

### Feature Flags (`FeatureFlagContext.tsx`)
Manages feature toggles and A/B testing:
- Feature availability
- User-specific feature access
- Experimental feature controls
- Beta testing groups

```tsx
const { isFeatureEnabled } = useFeatureFlags();
```

### Health Monitoring (`HealthContext.tsx`)
System health and status monitoring:
- Service availability
- Performance metrics
- Error tracking
- System alerts

```tsx
const { systemHealth, isHealthy } = useHealth();
```

### Makerspace Management (`MakerspaceContext.tsx`)
Current makerspace context and data:
- Active makerspace
- Makerspace settings
- Location-specific data
- Equipment and resources

```tsx
const { currentMakerspace, switchMakerspace } = useMakerspace();
```

### Member Management (`MemberContext.tsx`)
Member-related state and operations:
- Member directory
- Member permissions
- Skill certifications
- Membership status

```tsx
const { members, addMember, updateMember } = useMembers();
```

### Notifications (`NotificationContext.tsx`)
Real-time notification system:
- Toast notifications
- System alerts
- User notifications
- Push notification management

```tsx
const { showNotification, notifications } = useNotifications();
```

### Skills Management (`SkillContext.tsx`)
Skill certification and training:
- Available skills
- User certifications
- Training requirements
- Skill verification

```tsx
const { skills, certifyUser, getUserSkills } = useSkills();
```

## Usage Patterns

### Provider Setup
Wrap your app with the providers:

```tsx
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BillingProvider>
          <FeatureFlagProvider>
            <Router />
          </FeatureFlagProvider>
        </BillingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
```

### Consuming Context
Use the provided hooks in components:

```tsx
function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotifications();
  
  const handleAction = () => {
    if (!isAuthenticated) {
      showNotification('Please log in', 'error');
      return;
    }
    // Proceed with authenticated action
  };
  
  return (
    <div>
      {user ? `Welcome ${user.name}` : 'Please log in'}
    </div>
  );
}
```

## Context Architecture

### State Management Strategy
- Global state for cross-cutting concerns
- Local state for component-specific data
- React Query for server state
- Contexts for shared UI state

### Performance Considerations
- Memoize context values
- Split contexts by concern
- Avoid unnecessary re-renders
- Use React.memo for consumer components

### Error Handling
Each context includes:
- Error boundaries
- Fallback states
- Error reporting
- Graceful degradation

## Best Practices

### Context Design
- Single responsibility principle
- Clear separation of concerns
- Minimal, focused APIs
- Predictable state updates

### Hook Design
```tsx
// Good: Specific, clear API
const { user, login, logout } = useAuth();

// Avoid: Generic, unclear API
const authState = useAuth();
```

### Performance
- Use React.useMemo for expensive computations
- Implement proper dependency arrays
- Consider context splitting for performance
- Profile context re-renders

### Testing
- Mock contexts in tests
- Test provider behavior
- Verify hook functionality
- Test error scenarios

## Type Safety
All contexts use TypeScript with:
- Proper interface definitions
- Generic type parameters where applicable
- Runtime type checking for critical paths
- Exhaustive error handling