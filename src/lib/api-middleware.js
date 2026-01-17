import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionByToken } from './database-operations.js';

/**
 * Authentication middleware for API routes
 * @param {Request} request - The incoming request
 * @returns {Promise<Object>} Authentication result
 */
export async function authenticateRequest(request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token');

    if (!sessionToken) {
      return {
        authenticated: false,
        error: 'No session token provided',
        response: NextResponse.json(
          {
            success: false,
            error: 'Authentication required',
            message: 'You must be logged in to access this resource',
          },
          { status: 401 },
        ),
      };
    }

    // Verify session token (for now, we'll just check if it exists)
    // In a real implementation, you would validate against the database
    const session = await getSessionByToken(sessionToken.value);

    if (!session) {
      return {
        authenticated: false,
        error: 'Invalid session token',
        response: NextResponse.json(
          {
            success: false,
            error: 'Invalid session',
            message: 'Your session is invalid or has expired',
          },
          { status: 401 },
        ),
      };
    }

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      return {
        authenticated: false,
        error: 'Session expired',
        response: NextResponse.json(
          {
            success: false,
            error: 'Session expired',
            message: 'Your session has expired. Please log in again',
          },
          { status: 401 },
        ),
      };
    }

    return {
      authenticated: true,
      session,
      userId: session.userId,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      authenticated: false,
      error: 'Authentication failed',
      response: NextResponse.json(
        {
          success: false,
          error: 'Authentication failed',
          message: 'An error occurred during authentication',
        },
        { status: 500 },
      ),
    };
  }
}

/**
 * Validates request body against a schema
 * @param {Object} body - Request body to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result
 */
export function validateRequestBody(body, schema) {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = body[field];

    // Check required fields
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip validation if field is not provided and not required
    if (value === undefined || value === null) {
      continue;
    }

    // Type validation
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`);
      continue;
    }

    // String validations
    if (rules.type === 'string') {
      if (rules.minLength && value.trim().length < rules.minLength) {
        errors.push(
          `${field} must be at least ${rules.minLength} characters long`,
        );
      }
      if (rules.maxLength && value.trim().length > rules.maxLength) {
        errors.push(
          `${field} must be no more than ${rules.maxLength} characters long`,
        );
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }

    // Number validations
    if (rules.type === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${field} must be no more than ${rules.max}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Creates a standardized error response
 * @param {string} error - Error type
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {NextResponse} Error response
 */
export function createErrorResponse(error, message, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status },
  );
}

/**
 * Creates a standardized success response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} status - HTTP status code
 * @returns {NextResponse} Success response
 */
export function createSuccessResponse(data, message = 'Success', status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...data,
      message,
    },
    { status },
  );
}

/**
 * Handles API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - The operation that failed
 * @returns {NextResponse} Error response
 */
export function handleApiError(error, operation = 'operation') {
  console.error(`API Error during ${operation}:`, error);

  // Handle specific error types
  if (error.message.includes('not found')) {
    return createErrorResponse('Not found', error.message, 404);
  }

  if (
    error.message.includes('Invalid') ||
    error.message.includes('validation')
  ) {
    return createErrorResponse('Validation error', error.message, 400);
  }

  if (
    error.message.includes('Authentication') ||
    error.message.includes('Unauthorized')
  ) {
    return createErrorResponse('Authentication required', error.message, 401);
  }

  // Generic server error
  return createErrorResponse(
    'Internal server error',
    `Failed to ${operation}. Please try again later.`,
    500,
  );
}

/**
 * Parses query parameters with type conversion
 * @param {URL} url - Request URL
 * @param {Object} schema - Parameter schema
 * @returns {Object} Parsed parameters
 */
export function parseQueryParams(url, schema) {
  const { searchParams } = url;
  const params = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = searchParams.get(key);

    if (value === null) {
      if (rules.default !== undefined) {
        params[key] = rules.default;
      }
      continue;
    }

    // Type conversion
    switch (rules.type) {
      case 'number':
        const num = parseInt(value);
        if (!isNaN(num)) {
          params[key] = num;
        }
        break;
      case 'boolean':
        params[key] = value === 'true';
        break;
      case 'string':
      default:
        params[key] = value;
        break;
    }
  }

  return params;
}
