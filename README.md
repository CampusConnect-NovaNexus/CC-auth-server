# Authentication Server

A dual-protocol authentication service that provides both REST API (HTTP) and gRPC interfaces for user authentication.

## Features

- User registration and login
- JWT-based authentication
- Token validation and refresh
- Secure password hashing
- Protocol support: REST API and gRPC

## Technology Stack

- Node.js & TypeScript
- Express.js (HTTP API)
- gRPC (Protocol Buffers)
- Prisma ORM
- PostgreSQL/MySQL (configurable)
- JWT for token management
- bcryptjs for password hashing

## Project Structure

```
auth-server/
├── a.proto                 # Protocol buffer definition
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── grpc.ts             # gRPC server setup
│   ├── index.ts            # HTTP server setup
│   ├── email-templates/    # Email notification templates
│   ├── lib/                # Core functionality
│   │   ├── db.ts           # Database connection handling
│   │   ├── email.ts        # Email sending utilities
│   │   ├── hash.ts         # Password hashing utilities
│   │   └── jwt.ts          # JWT handling utilities
│   ├── proto/              # Generated Protocol Buffer files
│   ├── routes/             # HTTP route definitions
│   │   └── authRoutes.ts   # REST API routes
│   ├── services/           # Business logic
│   │   ├── authGrpcServices.ts  # gRPC service handlers
│   │   └── authService.ts       # Shared auth business logic
│   └── validators/         # Request validation
│       └── auth.ts         # Auth request validators
```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- Database (PostgreSQL or MySQL)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd auth-server
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

4. Set up the database
   ```bash
   npx prisma migrate dev
   ```

5. Build the project
   ```bash
   npm run build
   ```

### Running the Servers

Start both HTTP and gRPC servers:
```bash
npm start
```

Run in development mode with auto-restart:
```bash
npm run dev
```

## API Documentation

### REST API Endpoints

- **POST /auth/register**
  - Register a new user
  - Request Body: `{ "email": "user@example.com", "password": "securepass", "name": "User Name" }`
  - Response: `{ "accessToken": "...", "refreshToken": "..." }`

- **POST /auth/login**
  - Authenticate user
  - Request Body: `{ "email": "user@example.com", "password": "securepass" }`
  - Response: `{ "accessToken": "...", "refreshToken": "..." }`

- **POST /auth/validate-token**
  - Validate access token
  - Request Body: `{ "token": "your-token-here" }`
  - Response: `{ "valid": true }` or `{ "valid": false }`

- **POST /auth/refresh**
  - Refresh access token using refresh token
  - Request Body: `{ "token": "your-refresh-token-here" }`
  - Response: `{ "accessToken": "...", "refreshToken": "..." }`

### gRPC Service

The gRPC server implements the AuthService as defined in `a.proto`:

```protobuf
service AuthService {
  rpc Login(LoginRequest) returns (Tokens);
  rpc Register(RegisterRequest) returns (Tokens);
  rpc ValidateToken(Token) returns (ValidationResponse);
  rpc RefreshToken(Token) returns (Tokens);
}
```

#### Using the gRPC Service

To connect to the gRPC server, use the following address:
```
localhost:50051
```

Example gRPC client in Node.js:
```javascript
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./a.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.AuthService('localhost:50051', 
  grpc.credentials.createInsecure()
);

// Example login call
client.Login({ email: 'user@example.com', password: 'password123' }, 
  (err, response) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Tokens:', response);
  }
);
```

## Security Considerations

- For production use:
  - Always use HTTPS for the HTTP server
  - Use TLS for the gRPC server
  - Store JWT secret securely
  - Set appropriate token expiration times
