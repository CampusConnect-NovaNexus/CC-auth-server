# Authentication & User Service

This service handles user authentication, authorization, notification management, and user points system for the CampusConnect platform. It provides both REST API endpoints and gRPC services for communication with other microservices.

## Technologies
- Node.js
- Express.js
- TypeScript
- Prisma ORM with PostgreSQL
- gRPC
- JWT for authentication
- Expo Push Notifications
- Docker for containerization

## Architecture

The service has two main entry points:
1. **HTTP REST API**: Express.js server running on port 3500
2. **gRPC Server**: Running on port 50051 for inter-service communication

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Docker (optional, for containerized deployment)

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
PORT=3500
GRPC_PORT=50051
JWT_SECRET=your_jwt_secret
```

### Installation and Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build the project
npm run build

# Start the server (both HTTP and gRPC)
npm run start:all

# Or start them individually
npm run start       # HTTP server only
npm run start:grpc  # gRPC server only
```

### Docker Deployment
```bash
# Build Docker image
docker build -t campus-connect/auth-server .

# Run container
docker run -p 3500:3500 -p 50051:50051 --env-file .env campus-connect/auth-server
```

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

#### Get User by ID
- **Endpoint:** `GET /user/:id`
- **Parameters:** None (ID is in URL path)
- **Response:**
  - Success (200): User object with user details
  - Error (404): `{ "error": "User not found" }`
  - Error (500): `{ "error": "Internal server error", "details": "..." }`

#### Add User Profile/Socials
- **Endpoint:** `POST /user/addSocials`
- **Parameters:**
  ```json
  {
    "userId": "user_id", 
    "aboutMe": "Bio text",
    "instaLink": "instagram_link",
    "githubLink": "github_profile_link",
    "youtubeLink": "youtube_channel_link",
    "XLink": "twitter_link",
    "leetcodeLink": "leetcode_profile_link",
    "codeforcesLink": "codeforces_profile_link",
    "contactNo": "phone_number"
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Profile added successfully" }`
  - Error (400): `{ "error": "Missing required fields" }`
  - Error (500): `{ "error": "Internal server error", "details": "..." }`

#### Get User Profile
- **Endpoint:** `GET /user/getProfile/:userId`
- **Parameters:** None (userId is in URL path)
- **Response:**
  - Success (200): Profile object with social links and about information
  - Error (404): `{ "error": "User not found" }`
  - Error (500): `{ "error": "Internal server error" }`

### Notification Endpoints

#### Register Device for Push Notifications
- **Endpoint:** `POST /api/v1/notifications/register`
- **Parameters:**
  ```json
  {
    "userId": "user_id",
    "expoToken": "expo_push_token",
    "platform": "ios|android|web"
  }
  ```
- **Response:**
  - Success (201): `{ "success": true, "message": "Device registered successfully", "deviceId": "device_id" }`
  - Success (200): `{ "success": true, "message": "Device already registered", "deviceId": "device_id" }`
  - Error (400): `{ "success": false, "message": "Missing required fields" }`
  - Error (500): `{ "success": false, "message": "Error message" }`

#### Update Device Token
- **Endpoint:** `PUT /api/v1/notifications/update-token`
- **Parameters:**
  ```json
  {
    "oldToken": "old_expo_token",
    "newToken": "new_expo_token",
    "platform": "ios|android|web"
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Device token updated successfully" }`
  - Error (404): `{ "success": false, "message": "Device not found" }`
  - Error (500): `{ "success": false, "message": "Error message" }`

#### Remove Device
- **Endpoint:** `DELETE /api/v1/notifications/remove-device`
- **Parameters:**
  ```json
  {
    "expoToken": "expo_push_token"
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Device removed successfully" }`
  - Error (404): `{ "success": false, "message": "Device not found" }`
  - Error (500): `{ "success": false, "message": "Error message" }`

#### Send Notification to User
- **Endpoint:** `POST /api/v1/notifications/send/user`
- **Parameters:**
  ```json
  {
    "userId": "user_id",
    "title": "Notification title",
    "body": "Notification message",
    "data": {} // Optional additional data
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Notifications sent", "results": [] }`
  - Error (404): `{ "success": false, "message": "No devices registered for this user" }`
  - Error (500): `{ "success": false, "message": "Error message" }`

#### Send Notification to All Users
- **Endpoint:** `POST /api/v1/notifications/send/all`
- **Parameters:**
  ```json
  {
    "title": "Notification title",
    "body": "Notification message",
    "data": {} // Optional additional data
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Notifications sent to all devices", "results": [] }`
  - Error (404): `{ "success": false, "message": "No devices registered" }`
  - Error (500): `{ "success": false, "message": "Error message" }`

#### Send Notification by Filter
- **Endpoint:** `POST /api/v1/notifications/send/filter`
- **Parameters:**
  ```json
  {
    "filter": { 
      "roles": ["STUDENT"], 
      "verified": true
      // Any valid Prisma filter for User model
    },
    "title": "Notification title",
    "body": "Notification message",
    "data": {} // Optional additional data
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Notifications sent to X users", "results": [] }`
  - Error (404): `{ "success": false, "message": "No users match the specified criteria" }`
  - Error (500): `{ "success": false, "message": "Error message" }`

#### Send Warning Email
- **Endpoint:** `POST /api/v1/notifications/email`
- **Parameters:**
  ```json
  {
    "to": "recipient_email",
    "senderName": "Faculty Name",
    "studentName": "Student Name",
    "attendancePercentage": 75
  }
  ```
- **Response:**
  - Success (200): `{ "message": "Verification email sent", "result": {} }`
  - Error (500): `{ "error": "Failed to send verification email" }`

### Points System Endpoints

#### Get User Points
- **Endpoint:** `GET /api/v1/points/:userId`
- **Parameters:** None (userId is in URL path)
- **Response:**
  - Success (200): `{ "points": 100 }`
  - Error (400): `{ "error": "userId is required" }`
  - Error (404): `{ "error": "User not found" }`
  - Error (500): `{ "error": "Internal Server Error", "details": "Error message" }`

#### Add Points to User
- **Endpoint:** `POST /api/v1/points/:userId`
- **Parameters:**
  ```json
  {
    "pointsToAdd": 10
  }
  ```
- **Response:**
  - Success (200): `{ "message": "Points added successfully", "updatedUser": {} }`
  - Error (400): `{ "error": "userId and pointsToAdd are required" }`
  - Error (500): `{ "error": "Internal Server Error", "details": "Error message" }`

#### Get Top 10 Users by Points
- **Endpoint:** `GET /api/v1/points/top10`
- **Parameters:** None
- **Response:**
  - Success (200): Array of top 10 users with their points
  - Error (500): `{ "error": "Internal Server Error", "details": "Error message" }`

## gRPC Services

The service provides gRPC endpoints for inter-service communication defined in `a.proto`:

### Authentication Service

#### Login
- **Method:** `Login`
- **Request:** 
  ```proto
  message LoginRequest {
    string email = 1;
    string password = 2;
  }
  ```
- **Response:**
  ```proto
  message Tokens {
    string accessToken = 1;
    string refreshToken = 2;
  }
  ```

#### Register
- **Method:** `Register`
- **Request:**
  ```proto
  message RegisterRequest {
    string email = 1;
    string password = 2;
    string name = 3;
  }
  ```
- **Response:**
  ```proto
  message Tokens {
    string accessToken = 1;
    string refreshToken = 2;
  }
  ```

#### Validate Token
- **Method:** `ValidateToken`
- **Request:**
  ```proto
  message Token {
    string token = 1;
  }
  ```
- **Response:**
  ```proto
  message ValidationResponse {
    bool is_valid = 1;
  }
  ```

#### Refresh Token
- **Method:** `RefreshToken`
- **Request:**
  ```proto
  message Token {
    string token = 1;
  }
  ```
- **Response:**
  ```proto
  message Tokens {
    string accessToken = 1;
    string refreshToken = 2;
  }
  ```

## Database Schema

The service uses PostgreSQL with Prisma ORM. Main models include:

### User

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  points    Int      @default(0)
  roles     Role[]   @default([STUDENT])
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt @default(now())
  
  aboutMe         String?
  instaLink       String?
  githubLink      String?
  youtubeLink     String?
  XLink           String?
  leetcodeLink    String?
  codeforcesLink  String?
  contactNo       String?

  devices   Device[] 
}
```

### Device

```prisma
model Device {
  id          String   @id @default(uuid())
  userId      String
  expoToken   String   @unique
  platform    String   
  lastUsed    DateTime @default(now()) @updatedAt
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Developer Notes

1. Notification service uses Expo Push Notification service to deliver push notifications to mobile devices.
2. The service implements retry logic with exponential backoff for push notification delivery.
3. JWT tokens are used for authentication with a 15-minute expiry for access tokens and 30-day expiry for refresh tokens.
4. Email registration is restricted to institute emails ending with @nitm.ac.in
5. The points system provides gamification features for the campus platform.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#### Get User Profile
- **Endpoint:** `GET /user/getProfile/:userId`
- **Parameters:** None (userId is in URL path)
- **Response:**
  - Success (200): User profile object with social media details
  - Error (404): `{ "error": "Profile not found" }`
  - Error (500): `{ "error": "Internal server error", "details": "..." }`

### Notification Endpoints

#### Register Device for Push Notifications
- **Endpoint:** `POST /api/notifications/register`
- **Parameters:**
  ```json
  {
    "userId": "user_id",
    "expoToken": "expo_push_token",
    "platform": "ios|android|web"
  }
  ```
- **Response:**
  - Success (201): `{ "success": true, "message": "Device registered successfully" }`
  - Error (400): `{ "success": false, "message": "Missing required fields" }`
  - Error (401): `{ "success": false, "message": "Unauthorized" }`
  - Error (500): `{ "success": false, "message": "Server error: ..." }`

#### Update Device Token
- **Endpoint:** `PUT /api/notifications/update`
- **Parameters:**
  ```json
  {
    "userId": "user_id",
    "oldToken": "old_expo_token",
    "newToken": "new_expo_token",
    "platform": "ios|android|web"
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Token updated successfully" }`
  - Error (400): `{ "success": false, "message": "Missing required fields" }`
  - Error (401): `{ "success": false, "message": "Unauthorized" }`
  - Error (404): `{ "success": false, "message": "Device not found" }`
  - Error (500): `{ "success": false, "message": "Server error: ..." }`

#### Unregister Device
- **Endpoint:** `DELETE /api/notifications/unregister`
- **Parameters:**
  ```json
  {
    "userId": "user_id",
    "expoToken": "expo_push_token"
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Device unregistered successfully" }`
  - Error (400): `{ "success": false, "message": "Missing expo token" }`
  - Error (401): `{ "success": false, "message": "Unauthorized" }`
  - Error (404): `{ "success": false, "message": "Device not found" }`
  - Error (500): `{ "success": false, "message": "Server error: ..." }`

#### Send Notification to Specific User
- **Endpoint:** `POST /api/notifications/send/user/:userId`
- **Access:** Admin only
- **Parameters:**
  ```json
  {
    "title": "Notification Title",
    "body": "Notification Body",
    "data": {} // Optional additional data
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Notification sent successfully" }`
  - Error (400): `{ "success": false, "message": "Missing required fields" }`
  - Error (403): `{ "success": false, "message": "Forbidden" }`
  - Error (404): `{ "success": false, "message": "User not found" }`
  - Error (500): `{ "success": false, "message": "Server error: ..." }`

#### Send Notification to All Users
- **Endpoint:** `POST /api/notifications/send/all`
- **Access:** Admin only
- **Parameters:**
  ```json
  {
    "title": "Notification Title",
    "body": "Notification Body",
    "data": {} // Optional additional data
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Notification sent successfully" }`
  - Error (400): `{ "success": false, "message": "Missing required fields" }`
  - Error (403): `{ "success": false, "message": "Forbidden" }`
  - Error (500): `{ "success": false, "message": "Server error: ..." }`

#### Send Notification to Users by Role
- **Endpoint:** `POST /api/notifications/send/role/:role`
- **Access:** Admin only
- **Parameters:**
  ```json
  {
    "title": "Notification Title",
    "body": "Notification Body",
    "data": {} // Optional additional data
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Notification sent successfully" }`
  - Error (400): `{ "success": false, "message": "Missing required fields" }`
  - Error (403): `{ "success": false, "message": "Forbidden" }`
  - Error (404): `{ "success": false, "message": "No users found with specified role" }`
  - Error (500): `{ "success": false, "message": "Server error: ..." }`

#### Send Attendance Warning Email
- **Endpoint:** `POST /api/v1/notifications/email`
- **Parameters:**
  ```json
  {
    "to": "recipient_email",
    "senderName": "Faculty Name",
    "studentName": "Student Name",
    "attendancePercentage": 75
  }
  ```
- **Response:**
  - Success (200): `{ "message": "Verification email sent", "result": {} }`
  - Error (400): `{ "error": "Failed to send verification email" }`
  - Error (500): `{ "error": "Failed to send verification email" }`

### Points System Endpoints

#### Get Top 10 Users by Points
- **Endpoint:** `GET /api/points/top10`
- **Parameters:** None
- **Response:**
  - Success (200): Array of top 10 users with their points
    ```json
    [
      {
        "id": "user_id",
        "name": "User Name",
        "points": 100
      },
      ...
    ]
    ```
  - Error (500): `{ "error": "Internal Server Error", "details": "..." }`

#### Get User Points
- **Endpoint:** `GET /api/points/:userId`
- **Parameters:** None (userId is in URL path)
- **Response:**
  - Success (200): `{ "points": 100 }`
  - Error (400): `{ "error": "userId is required" }`
  - Error (404): `{ "error": "User not found" }`
  - Error (500): `{ "error": "Internal Server Error", "details": "..." }`

#### Add Points to User
- **Endpoint:** `POST /api/points/:userId`
- **Parameters:**
  ```json
  {
    "pointsToAdd": 10
  }
  ```
- **Response:**
  - Success (200): `{ "message": "Points added successfully", "updatedUser": {...} }`
  - Error (400): `{ "error": "userId and pointsToAdd are required" }`
  - Error (500): `{ "error": "Internal Server Error", "details": "..." }`

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
