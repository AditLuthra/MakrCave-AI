# Overview

MakrCave is an enterprise-grade makerspace management platform that provides comprehensive tools for managing makerspaces, equipment, inventory, members, projects, and operations. Originally migrated from MyTrial, this platform offers advanced features including multi-tenant architecture, role-based access control, equipment reservations, inventory management, project collaboration, and billing systems. The application serves both as a makerspace discovery platform and a complete management solution for FabLabs and makerspaces worldwide.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture (Next.js + React)
The frontend is built using **Next.js 14** with **React 18** and TypeScript:
- **Framework**: Next.js 14 with App Router for modern React development
- **Authentication**: Keycloak integration for enterprise SSO and role-based access
- **UI Framework**: Radix UI primitives with custom component library
- **Styling**: Tailwind CSS with custom design system and dark mode support
- **State Management**: React Context API with providers for auth, notifications, and features
- **Build Tools**: Hybrid Next.js/Vite configuration for development flexibility

## Backend Architecture (FastAPI + Python)
The server follows a **microservices-ready architecture** using FastAPI:
- **Framework**: FastAPI with Pydantic for API validation and OpenAPI documentation
- **Authentication**: JWT-based authentication with Keycloak integration
- **Database**: PostgreSQL with SQLAlchemy ORM for data persistence
- **Security**: Comprehensive middleware for rate limiting, input validation, and CORS
- **Multi-tenancy**: Makerspace-isolated data access with role-based permissions

## Data Storage Solutions
**Database Schema** (Drizzle ORM with PostgreSQL):
- **Users Table**: Basic authentication with username/password
- **Locations Table**: Comprehensive makerspace information including geolocation, contact details, equipment lists, and ratings
- **Contacts Table**: Contact form submissions with categorization
- **Schema Validation**: Zod schemas for runtime type validation and API input validation

**Current State**: Uses in-memory storage for development with sample data, designed to migrate to PostgreSQL in production.

## Component Organization
- **Pages**: Top-level route components (Home, Locations, LocationDetail, About)
- **Sections**: Reusable page sections (Hero, FeaturedLocations, Community, Contact)
- **Common Components**: Shared business logic components (LocationCard, NetworkMap)
- **UI Components**: Base design system components from shadcn/ui
- **Layout Components**: Header and Footer with consistent navigation

## API Design
RESTful endpoints following resource-based naming:
- `GET /api/locations` - Retrieve all locations
- `GET /api/locations/featured` - Get featured locations for homepage
- `GET /api/locations/:id` - Get specific location details
- `GET /api/locations/search/:query` - Search locations by text query
- `POST /api/contact` - Handle contact form submissions

# External Dependencies

## Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Router alternative (Wouter)
- **UI Components**: Radix UI primitives for accessible component foundations
- **Styling**: Tailwind CSS for utility-first styling with PostCSS processing
- **State Management**: TanStack React Query for server state and caching
- **Form Handling**: React Hook Form with Hookform Resolvers for form validation
- **Utilities**: clsx and tailwind-merge for conditional className handling, date-fns for date manipulation

## Backend Dependencies
- **Server Framework**: Express.js for HTTP server and routing
- **Database**: Neon serverless PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type validation and schema definitions

## Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Replit Integration**: Vite plugins for Replit development environment
- **Database Migrations**: Drizzle Kit for database schema management
- **TypeScript**: Full TypeScript support with strict configuration

## Third-Party Services
- **Database Hosting**: Configured for Neon serverless PostgreSQL
- **Image Storage**: Uses Unsplash for sample location images
- **Fonts**: Google Fonts integration (Inter, JetBrains Mono)
- **Icons**: Lucide React for consistent iconography, React Icons for brand icons

The application is designed to be easily deployable on Replit with built-in support for the platform's development environment and deployment pipeline.