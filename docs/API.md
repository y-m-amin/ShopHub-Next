# API Documentation

## Overview

The ShopHub API provides RESTful endpoints for authentication and item management. All endpoints return JSON responses with consistent error handling and status codes.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses cookie-based session authentication. Protected endpoints require a valid session token stored in HTTP-only cookies.

### Session Management

Sessions are automatically managed through the authentication endpoints. The session token is stored as an HTTP-only cookie named `session-token`.

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "error_type",
  "message": "Human-readable error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### Authentication

#### POST /api/auth/login

Authenticate user with email and password.

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Validation Rules:**

- `email`: Must be a valid email format
- `password`: Minimum 6 characters

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  },
  "message": "Login successful"
}
```

**Error Responses:**

- `400` - Invalid credentials format
- `401` - Invalid email or password

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

#### POST /api/auth/logout

Logout current user and clear session.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: session-token=your-session-token"
```

#### GET /api/auth/session

Get current user session information.

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  },
  "authenticated": true
}
```

**Unauthenticated Response (200):**

```json
{
  "success": true,
  "user": null,
  "authenticated": false
}
```

### Items

#### GET /api/items

Retrieve all items (public access).

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search term for name/description
- `category` (optional): Filter by category

**Success Response (200):**

```json
{
  "success": true,
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "image": "string",
      "category": "string",
      "inStock": "boolean",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)",
      "createdBy": "string (user ID)"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

**Example:**

```bash
curl http://localhost:3000/api/items?page=1&limit=5
```

#### GET /api/items/[id]

Retrieve specific item by ID (public access).

**Path Parameters:**

- `id`: Item ID (required)

**Success Response (200):**

```json
{
  "success": true,
  "item": {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "image": "string",
    "category": "string",
    "inStock": "boolean",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "createdBy": "string (user ID)"
  }
}
```

**Error Responses:**

- `404` - Item not found

**Example:**

```bash
curl http://localhost:3000/api/items/item-123
```

#### POST /api/items (Protected)

Create new item. Requires authentication.

**Request Body:**

```json
{
  "name": "string (required, 1-100 chars)",
  "description": "string (required, 1-1000 chars)",
  "price": "number (required, > 0)",
  "image": "string (optional, valid URL)",
  "category": "string (optional, 1-50 chars)"
}
```

**Validation Rules:**

- `name`: Required, 1-100 characters
- `description`: Required, 1-1000 characters
- `price`: Required, positive number
- `image`: Optional, valid URL format
- `category`: Optional, 1-50 characters

**Success Response (201):**

```json
{
  "success": true,
  "item": {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "image": "string",
    "category": "string",
    "inStock": true,
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "createdBy": "string (user ID)"
  },
  "message": "Item created successfully"
}
```

**Error Responses:**

- `400` - Validation errors
- `401` - Authentication required

**Example:**

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Cookie: session-token=your-session-token" \
  -d '{
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 199.99,
    "category": "Electronics"
  }'
```

#### PUT /api/items/[id] (Protected)

Update existing item. Requires authentication.

**Path Parameters:**

- `id`: Item ID (required)

**Request Body:**

```json
{
  "name": "string (optional, 1-100 chars)",
  "description": "string (optional, 1-1000 chars)",
  "price": "number (optional, > 0)",
  "image": "string (optional, valid URL)",
  "category": "string (optional, 1-50 chars)",
  "inStock": "boolean (optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "item": {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "image": "string",
    "category": "string",
    "inStock": "boolean",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "createdBy": "string (user ID)"
  },
  "message": "Item updated successfully"
}
```

**Error Responses:**

- `400` - Validation errors
- `401` - Authentication required
- `404` - Item not found

#### DELETE /api/items/[id] (Protected)

Delete item. Requires authentication.

**Path Parameters:**

- `id`: Item ID (required)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

**Error Responses:**

- `401` - Authentication required
- `404` - Item not found

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/items/item-123 \
  -H "Cookie: session-token=your-session-token"
```

## Error Handling

### Common Error Types

#### Validation Errors (400)

```json
{
  "success": false,
  "error": "Validation error",
  "message": "name is required, price must be greater than 0",
  "details": ["name is required", "price must be greater than 0"]
}
```

#### Authentication Errors (401)

```json
{
  "success": false,
  "error": "Authentication required",
  "message": "You must be logged in to access this resource"
}
```

#### Not Found Errors (404)

```json
{
  "success": false,
  "error": "Not found",
  "message": "Item with ID 'item-123' not found"
}
```

#### Server Errors (500)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred. Please try again later."
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing:

- 100 requests per minute per IP for public endpoints
- 1000 requests per minute per authenticated user for protected endpoints

## CORS

CORS is configured to allow requests from the same origin. For cross-origin requests, update the CORS configuration in the API middleware.

## Security

### Authentication Security

- Sessions use HTTP-only cookies
- Session tokens are cryptographically secure
- Sessions expire after 24 hours of inactivity

### Input Validation

- All inputs are validated and sanitized
- SQL injection protection (not applicable with JSON database)
- XSS prevention through input sanitization

### HTTPS

In production, ensure all API requests use HTTPS to protect sensitive data in transit.

## Testing

### Example Test Requests

You can test the API using the provided examples or tools like:

- **curl**: Command-line HTTP client
- **Postman**: GUI-based API testing tool
- **Insomnia**: REST client for API testing

### Authentication Flow Test

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt

# 2. Create item (using saved cookies)
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Test Item","description":"Test description","price":29.99}'

# 3. Get items
curl http://localhost:3000/api/items

# 4. Logout
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```

## Changelog

### Version 1.0.0

- Initial API implementation
- Authentication endpoints
- Item CRUD operations
- Comprehensive error handling
- Input validation and sanitization
