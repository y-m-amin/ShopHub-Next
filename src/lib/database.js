import fs from 'fs/promises';
import path from 'path';

// Database file path
const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

// Default database structure
const DEFAULT_DATABASE = {
  users: [],
  items: [],
  sessions: [],
  metadata: {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  },
};

/**
 * Ensures the database directory exists
 */
async function ensureDataDirectory() {
  const dataDir = path.dirname(DB_PATH);
  try {
    await fs.access(dataDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dataDir, { recursive: true });
    } else {
      throw error;
    }
  }
}

/**
 * Initializes the database with default structure if it doesn't exist
 */
async function initializeDatabase() {
  try {
    await ensureDataDirectory();
    await fs.access(DB_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Database doesn't exist, create it
      await writeDatabase(DEFAULT_DATABASE);
    } else {
      throw new Error(`Failed to access database: ${error.message}`);
    }
  }
}

/**
 * Reads the entire database from the JSON file
 * @returns {Promise<Object>} The database object
 */
async function readDatabase() {
  try {
    await initializeDatabase();
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Database file is corrupted. Invalid JSON format.');
    }
    throw new Error(`Failed to read database: ${error.message}`);
  }
}

/**
 * Writes the entire database to the JSON file
 * @param {Object} database - The database object to write
 */
async function writeDatabase(database) {
  try {
    await ensureDataDirectory();

    // Update metadata
    database.metadata = {
      ...database.metadata,
      lastUpdated: new Date().toISOString(),
    };

    const data = JSON.stringify(database, null, 2);
    await fs.writeFile(DB_PATH, data, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write database: ${error.message}`);
  }
}

/**
 * Performs a safe database operation with file locking simulation
 * @param {Function} operation - The operation to perform on the database
 * @returns {Promise<any>} The result of the operation
 */
async function performDatabaseOperation(operation) {
  const lockFile = `${DB_PATH}.lock`;

  try {
    // Simple file locking mechanism
    try {
      await fs.access(lockFile);
      // Lock file exists, wait and retry
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await performDatabaseOperation(operation);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Create lock file
    await fs.writeFile(lockFile, process.pid.toString());

    // Read current database
    const database = await readDatabase();

    // Perform operation
    const result = await operation(database);

    // Write updated database if operation modified it
    if (result && result.database) {
      await writeDatabase(result.database);
      return result.data;
    }

    return result;
  } finally {
    // Remove lock file
    try {
      await fs.unlink(lockFile);
    } catch (error) {
      // Ignore errors when removing lock file
    }
  }
}

/**
 * Generates a unique ID
 * @returns {string} A unique identifier
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Validates user data
 * @param {Object} user - User object to validate
 * @returns {Object} Validation result
 */
function validateUser(user) {
  const errors = [];

  if (
    !user.email ||
    typeof user.email !== 'string' ||
    user.email.trim() === ''
  ) {
    errors.push('Email is required and must be a non-empty string');
  }

  if (!user.name || typeof user.name !== 'string' || user.name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }

  // Validate email format
  if (
    user.email &&
    typeof user.email === 'string' &&
    user.email.trim() !== ''
  ) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email.trim())) {
      errors.push('Email must be a valid email address');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates item data
 * @param {Object} item - Item object to validate
 * @returns {Object} Validation result
 */
function validateItem(item) {
  const errors = [];

  if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }

  if (
    !item.description ||
    typeof item.description !== 'string' ||
    item.description.trim() === ''
  ) {
    errors.push('Description is required and must be a non-empty string');
  }

  if (
    typeof item.price !== 'number' ||
    item.price < 0 ||
    !isFinite(item.price)
  ) {
    errors.push('Price is required and must be a non-negative finite number');
  }

  // Validate price precision (max 2 decimal places for currency)
  if (
    typeof item.price === 'number' &&
    isFinite(item.price) &&
    item.price >= 0
  ) {
    const decimalPlaces = (item.price.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      errors.push('Price must have at most 2 decimal places');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Export all functions
export {
  DB_PATH,
  DEFAULT_DATABASE,
  generateId,
  initializeDatabase,
  performDatabaseOperation,
  readDatabase,
  validateItem,
  validateUser,
  writeDatabase,
};
