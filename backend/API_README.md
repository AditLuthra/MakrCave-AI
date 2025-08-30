# MakrCave Backend API

## Overview
The MakrCave Backend API is a comprehensive FastAPI-based microservice that provides the server-side functionality for the MakrCave makerspace management platform. It handles authentication, data management, business logic, and integrations for the entire ecosystem.

## Architecture

### Directory Structure
```
backend/
├── crud/              # Database operations (Create, Read, Update, Delete)
├── middleware/        # Request/response middleware
├── migrations_disabled/ # Database migration scripts
├── models/           # SQLAlchemy database models
├── routes/           # API endpoint definitions
├── schemas/          # Pydantic request/response schemas
├── security/         # Authentication and security utilities
├── services/         # External service integrations
├── tests/            # Unit and integration tests
├── utils/            # Utility functions and helpers
├── main.py           # FastAPI application entry point
├── database.py       # Database configuration
├── dependencies.py   # Dependency injection
└── start.py          # Application startup script
```

### Key Components

#### CRUD Operations (`crud/`)
- Database abstraction layer
- Type-safe database operations
- Optimized queries for performance
- Transaction management

#### Models (`models/`)
- SQLAlchemy ORM models
- Database table definitions
- Relationship mappings
- Data validation at DB level

#### Routes (`routes/`)
- RESTful API endpoints
- Request validation
- Response formatting
- Error handling
- Authentication requirements

#### Schemas (`schemas/`)
- Pydantic models for API contracts
- Request/response validation
- Data serialization/deserialization
- OpenAPI documentation generation

#### Security (`security/`)
- JWT token validation
- Keycloak integration
- Role-based access control
- Input sanitization
- Rate limiting

## API Endpoints

### Authentication
- `/auth/login` - User authentication
- `/auth/refresh` - Token refresh
- `/auth/logout` - User logout

### Core Entities
- `/api/members/` - Member management
- `/api/equipment/` - Equipment tracking
- `/api/inventory/` - Inventory management
- `/api/projects/` - Project management
- `/api/billing/` - Billing and payments
- `/api/analytics/` - Usage analytics

### Advanced Features
- `/api/reservations/` - Equipment reservations
- `/api/access-control/` - Makerspace access management
- `/api/notifications/` - User notifications
- `/api/collaboration/` - Project collaboration
- `/api/job-management/` - Print job management

## Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- Redis (for caching)

### Installation
```bash
cd backend
pip install -r requirements.txt
```

### Configuration
Copy `.env.example` to `.env` and configure:
- Database connection
- Keycloak settings
- API keys and secrets
- External service URLs

### Running the Server
```bash
# Development
python start.py

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

### API Documentation
- Interactive docs: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints throughout
- Comprehensive docstrings
- Run `./format.sh` before commits

### Testing
```bash
# Run all tests
pytest tests/

# Run with coverage
pytest --cov=. tests/
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## Security

### Authentication Flow
1. Frontend redirects to Keycloak
2. User authenticates with Keycloak
3. Keycloak returns JWT token
4. Backend validates JWT on each request
5. Token refresh handled automatically

### Data Protection
- All sensitive data encrypted at rest
- JWT tokens for stateless authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting on all endpoints

## Monitoring

### Health Checks
- `/health` - Basic health status
- `/health/detailed` - Comprehensive system status
- Database connectivity checks
- External service availability

### Logging
- Structured JSON logging
- Request/response logging
- Error tracking with Sentry
- Performance metrics

## Deployment

### Docker
```bash
docker build -t makrcave-backend .
docker run -p 8000:8000 makrcave-backend
```

### Production Considerations
- Use PostgreSQL for production database
- Configure Redis for session storage
- Set up SSL/TLS termination
- Configure proper logging
- Monitor resource usage

## Contributing

1. Follow the established code style
2. Add tests for new functionality
3. Update documentation
4. Ensure all tests pass
5. Run security checks

For detailed API documentation, visit `/docs` when running the server.