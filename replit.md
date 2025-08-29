# Overview

MakrCave is a global maker network platform that connects makerspaces, FabLabs, and individual makers worldwide. The application serves as a discovery platform where users can find and explore makerspaces, view their equipment, contact locations, and access information about the global maker community. Built as a full-stack web application, it provides a comprehensive directory of maker facilities with search capabilities, featured locations, and detailed facility information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using **React 18** with **TypeScript** and follows a component-based architecture:
- **Routing**: Uses Wouter for lightweight client-side routing with pages for home, locations listing, location details, and about
- **State Management**: Leverages React Query (TanStack Query) for server state management and caching
- **UI Framework**: Implements shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Uses Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The server follows a **RESTful API** architecture using Express.js:
- **Framework**: Express.js with TypeScript for type safety
- **Route Structure**: Organized route handlers in separate modules with clear endpoint definitions
- **Data Layer**: Abstracted storage interface (IStorage) allowing for different implementations
- **Current Implementation**: In-memory storage with sample data for development
- **Middleware**: Custom logging middleware for API request monitoring

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