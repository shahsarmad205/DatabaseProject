# Apartment Management System

## Setup Instructions

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Web browser

### Database Setup

1. Create MySQL database:

```sql
CREATE DATABASE apartment_db;
```

2. Update database credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=yourpassword
```

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Open `index.html` in a web browser, or use a simple HTTP server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## API Endpoints

### Buildings

- GET `/api/buildings` - List all buildings
- POST `/api/buildings` - Create building
- PUT `/api/buildings/{id}` - Update building
- DELETE `/api/buildings/{id}` - Delete building
- GET `/api/buildings/{id}/tenants` - List tenants in building

### Apartment Units

- GET `/api/apartment-units` - List all units
- POST `/api/apartment-units` - Create unit
- PUT `/api/apartment-units/{id}` - Update unit
- DELETE `/api/apartment-units/{id}` - Delete unit

### Tenants

- GET `/api/tenants` - List all tenants
- POST `/api/tenants` - Create tenant
- PUT `/api/tenants/{id}` - Update tenant
- DELETE `/api/tenants/{id}` - Delete tenant

### Lease Agreements

- GET `/api/leases` - List all leases
- GET `/api/leases/active` - List active leases
- POST `/api/leases` - Create lease
- PUT `/api/leases/{id}` - Update lease
- DELETE `/api/leases/{id}` - Delete lease

### Maintenance Requests

- GET `/api/maintenance` - List all requests
- GET `/api/maintenance/status/{status}` - Filter by status
- GET `/api/maintenance/priority/{priority}` - Filter by priority
- POST `/api/maintenance` - Create request
- PUT `/api/maintenance/{id}` - Update request
- DELETE `/api/maintenance/{id}` - Delete request
