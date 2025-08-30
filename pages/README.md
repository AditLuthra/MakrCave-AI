# Pages Directory

## Overview
This directory contains all the main page components for the MakrCave application. Each file represents a distinct route or view in the application.

## Page Structure

### Core Application Pages
- `Dashboard.tsx` - Main dashboard after login
- `LandingPage.tsx` - Public homepage and marketing
- `Login.tsx` - User authentication page
- `Register.tsx` - User registration page
- `Profile.tsx` - User profile management

### Makerspace Management
- `FindMakerspace.tsx` - Public makerspace discovery
- `Map.tsx` - Interactive makerspace map
- `Contact.tsx` - Contact form and information

### Equipment & Inventory
- `Equipment.tsx` - Equipment listing and management
- `EnhancedEquipment.tsx` - Advanced equipment features
- `Inventory.tsx` - Inventory management
- `EnhancedInventory.tsx` - Advanced inventory features
- `SmartInventory.tsx` - AI-powered inventory insights

### Project Management
- `Projects.tsx` - Project listing and management
- `ProjectDetail.tsx` - Individual project details
- `ProjectShowcase.tsx` - Public project showcase
- `PublicProjects.tsx` - Public project gallery

### Reservations & Access
- `Reservations.tsx` - Equipment reservation system
- `EquipmentAccess.tsx` - Access control management

### Members & Community
- `Members.tsx` - Member management
- `Community.tsx` - Community features
- `MembershipPlans.tsx` - Subscription management

### Analytics & Reporting
- `Analytics.tsx` - Usage analytics dashboard
- `Billing.tsx` - Financial management

### Advanced Features
- `EnhancedJobs.tsx` - Job queue management
- `Maintenance.tsx` - Equipment maintenance
- `AdvancedMaintenance.tsx` - Advanced maintenance features
- `Announcements.tsx` - System announcements
- `NotificationsCenter.tsx` - Notification management

### Administrative
- `Settings.tsx` - Application settings
- `SystemHealth.tsx` - System monitoring
- `ErrorLogs.tsx` - Error tracking
- `SkillManagement.tsx` - User skill certification

### Learning & Development
- `LearningCenter.tsx` - Educational resources
- `OnboardingPage.tsx` - User onboarding flow

### Integration & Collaboration
- `Integrations.tsx` - Third-party integrations
- `CollaborationDemo.tsx` - Collaboration features
- `MakrVerse.tsx` - Social features

### Admin Pages (`admin/`)
- `Users.tsx` - User management
- `Makerspaces.tsx` - Makerspace administration
- `Makerspace.tsx` - Individual makerspace management
- `FeatureFlags.tsx` - Feature toggle management

### Specialized Pages
- `AuthCallback.tsx` - OAuth callback handling
- `ForgotPassword.tsx` - Password reset
- `NotFound.tsx` - 404 error page
- `CapacityPlanning.tsx` - Capacity management

## Page Component Guidelines

### Structure
Each page should follow this structure:
```tsx
import { PageLayout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';

interface PageNameProps {
  // Props if needed
}

export function PageName({ ...props }: PageNameProps) {
  return (
    <PageLayout>
      <PageHeader 
        title="Page Title" 
        description="Page description"
      />
      <main>
        {/* Page content */}
      </main>
    </PageLayout>
  );
}
```

### Routing
Pages are automatically routed based on their file structure when using Next.js App Router or configured in the routing system.

### Data Fetching
- Use React Query for server state
- Implement proper loading states
- Handle errors gracefully
- Cache data appropriately

### SEO & Meta
Each page should include:
- Proper page titles
- Meta descriptions
- Open Graph tags
- Schema markup where applicable

### Accessibility
- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

## Authentication
Pages requiring authentication should:
- Use the ProtectedRoute component
- Handle unauthorized access
- Redirect to login when needed

## Error Handling
All pages should:
- Include error boundaries
- Show user-friendly error messages
- Log errors for monitoring
- Provide recovery actions

## Performance
- Implement code splitting
- Use React.lazy for route-based splitting
- Optimize bundle sizes
- Monitor Core Web Vitals