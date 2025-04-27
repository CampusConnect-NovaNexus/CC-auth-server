# Authentication Service

This service handles user authentication and authorization for the CampusConnect platform.

## Technologies
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- gRPC

## API Routes

### Authentication Endpoints

#### Register a new user
- **Endpoint:** `POST /register`
- **Parameters:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "User Name" // optional
  }
  ```
- **Response:**
  - Success (200):
    ```json
    {
      "message": "User Created successfully",
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
    ```
  - Error (400): `{ "error": "Invalid data" }`
  - Error (409): `{ "error": "User already exists" }`
  - Error (500): `{ "error": "Internal server error", "details": "..." }`

#### Login
- **Endpoint:** `POST /login`
- **Parameters:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:**
  - Success (200):
    ```json
    {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
    ```
  - Error (400): `{ "error": "Invalid data" }`
  - Error (401): `{ "error": "Invalid credentials" }`

#### Refresh Token
- **Endpoint:** `POST /refresh-token`
- **Parameters:**
  ```json
  {
    "refreshToken": "jwt_refresh_token"
  }
  ```
- **Response:**
  - Success (200):
    ```json
    {
      "accessToken": "new_jwt_access_token",
      "refreshToken": "new_jwt_refresh_token"
    }
    ```
  - Error (401): `{ "error": "Refresh token is required" }` or `{ "error": "Invalid refresh token" }`

## gRPC Services

The service also provides gRPC endpoints for internal service communication:

- **ValidateToken**: Validates a JWT token and returns user information
- **GetUserById**: Retrieves user information by ID
- **GetUserByEmail**: Retrieves user information by email

## Setup and Deployment

This service can be run independently or as part of the Docker Compose setup.

### Environment Variables

Create an `.env` or `.env.docker` file with the following variables:
```
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret_key
GRPC_HOST=0.0.0.0
GRPC_PORT=50053
PORT=3000
```

### Running the Service

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production
npm run build
npm start
```

### Docker Deployment
The service is configured to run in the Docker Compose setup of the CampusConnect platform.
