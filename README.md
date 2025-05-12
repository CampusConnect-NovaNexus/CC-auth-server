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
    "socials": {
      "instagram": "instagram_handle",
      "twitter": "twitter_handle",
      "facebook": "facebook_profile"
    }
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
