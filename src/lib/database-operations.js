import {
  generateId,
  performDatabaseOperation,
  validateItem,
  validateUser,
} from './database.js';

// User operations

/**
 * Creates a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user or error
 */
export async function createUser(userData) {
  // Sanitize input data
  const sanitizedData = {
    ...userData,
    email: userData.email
      ? userData.email.trim().toLowerCase()
      : userData.email,
    name: userData.name ? userData.name.trim() : userData.name,
  };

  const validation = validateUser(sanitizedData);
  if (!validation.isValid) {
    throw new Error(`Invalid user data: ${validation.errors.join(', ')}`);
  }

  return await performDatabaseOperation(async (database) => {
    // Check if user already exists
    const existingUser = database.users.find(
      (user) => user.email === sanitizedData.email,
    );
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: generateId(),
      email: sanitizedData.email,
      name: sanitizedData.name,
      image: sanitizedData.image || null,
      role: sanitizedData.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    database.users.push(newUser);

    return {
      database,
      data: newUser,
    };
  });
}

/**
 * Gets a user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function getUserById(userId) {
  return await performDatabaseOperation(async (database) => {
    return database.users.find((user) => user.id === userId) || null;
  });
}

/**
 * Gets a user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function getUserByEmail(email) {
  return await performDatabaseOperation(async (database) => {
    return database.users.find((user) => user.email === email) || null;
  });
}

/**
 * Updates a user
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user or error
 */
export async function updateUser(userId, updateData) {
  return await performDatabaseOperation(async (database) => {
    const userIndex = database.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...database.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Validate updated user
    const validation = validateUser(updatedUser);
    if (!validation.isValid) {
      throw new Error(`Invalid user data: ${validation.errors.join(', ')}`);
    }

    database.users[userIndex] = updatedUser;

    return {
      database,
      data: updatedUser,
    };
  });
}

/**
 * Deletes a user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteUser(userId) {
  return await performDatabaseOperation(async (database) => {
    const userIndex = database.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    database.users.splice(userIndex, 1);

    return {
      database,
      data: true,
    };
  });
}

// Item operations

/**
 * Creates a new item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created item or error
 */
export async function createItem(itemData) {
  // Sanitize input data
  const sanitizedData = {
    ...itemData,
    name: itemData.name ? itemData.name.trim() : itemData.name,
    description: itemData.description
      ? itemData.description.trim()
      : itemData.description,
    price:
      typeof itemData.price === 'number'
        ? Math.round(itemData.price * 100) / 100
        : itemData.price, // Round to 2 decimal places
  };

  const validation = validateItem(sanitizedData);
  if (!validation.isValid) {
    throw new Error(`Invalid item data: ${validation.errors.join(', ')}`);
  }

  return await performDatabaseOperation(async (database) => {
    const newItem = {
      id: generateId(),
      name: sanitizedData.name,
      description: sanitizedData.description,
      price: sanitizedData.price,
      image: sanitizedData.image || null,
      category: sanitizedData.category || null,
      inStock:
        sanitizedData.inStock !== undefined ? sanitizedData.inStock : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: sanitizedData.createdBy || null,
    };

    database.items.push(newItem);

    return {
      database,
      data: newItem,
    };
  });
}

/**
 * Gets all items
 * @param {Object} options - Query options (limit, offset, category)
 * @returns {Promise<Object>} Items array and total count
 */
export async function getAllItems(options = {}) {
  return await performDatabaseOperation(async (database) => {
    let items = [...database.items];

    // Filter by category if specified
    if (options.category) {
      items = items.filter((item) => item.category === options.category);
    }

    // Filter by inStock if specified
    if (options.inStock !== undefined) {
      items = items.filter((item) => item.inStock === options.inStock);
    }

    const total = items.length;

    // Apply pagination
    if (options.offset) {
      items = items.slice(options.offset);
    }
    if (options.limit) {
      items = items.slice(0, options.limit);
    }

    return {
      items,
      total,
    };
  });
}

/**
 * Gets an item by ID
 * @param {string} itemId - Item ID
 * @returns {Promise<Object|null>} Item object or null if not found
 */
export async function getItemById(itemId) {
  return await performDatabaseOperation(async (database) => {
    return database.items.find((item) => item.id === itemId) || null;
  });
}

/**
 * Updates an item
 * @param {string} itemId - Item ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated item or error
 */
export async function updateItem(itemId, updateData) {
  return await performDatabaseOperation(async (database) => {
    const itemIndex = database.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    const updatedItem = {
      ...database.items[itemIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Validate updated item
    const validation = validateItem(updatedItem);
    if (!validation.isValid) {
      throw new Error(`Invalid item data: ${validation.errors.join(', ')}`);
    }

    database.items[itemIndex] = updatedItem;

    return {
      database,
      data: updatedItem,
    };
  });
}

/**
 * Deletes an item
 * @param {string} itemId - Item ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteItem(itemId) {
  return await performDatabaseOperation(async (database) => {
    const itemIndex = database.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    database.items.splice(itemIndex, 1);

    return {
      database,
      data: true,
    };
  });
}

// Session operations

/**
 * Creates a new session
 * @param {Object} sessionData - Session data
 * @returns {Promise<Object>} Created session
 */
export async function createSession(sessionData) {
  return await performDatabaseOperation(async (database) => {
    const newSession = {
      id: generateId(),
      userId: sessionData.userId,
      sessionToken: sessionData.sessionToken || generateId(),
      expires: sessionData.expires,
      createdAt: new Date().toISOString(),
    };

    database.sessions.push(newSession);

    return {
      database,
      data: newSession,
    };
  });
}

/**
 * Gets a session by token
 * @param {string} sessionToken - Session token
 * @returns {Promise<Object|null>} Session object or null if not found
 */
export async function getSessionByToken(sessionToken) {
  return await performDatabaseOperation(async (database) => {
    return (
      database.sessions.find(
        (session) => session.sessionToken === sessionToken,
      ) || null
    );
  });
}

/**
 * Deletes a session
 * @param {string} sessionToken - Session token
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSession(sessionToken) {
  return await performDatabaseOperation(async (database) => {
    const sessionIndex = database.sessions.findIndex(
      (session) => session.sessionToken === sessionToken,
    );
    if (sessionIndex === -1) {
      return false;
    }

    database.sessions.splice(sessionIndex, 1);

    return {
      database,
      data: true,
    };
  });
}

/**
 * Cleans up expired sessions
 * @returns {Promise<number>} Number of sessions cleaned up
 */
export async function cleanupExpiredSessions() {
  return await performDatabaseOperation(async (database) => {
    const now = new Date();
    const initialCount = database.sessions.length;

    database.sessions = database.sessions.filter((session) => {
      return new Date(session.expires) > now;
    });

    const cleanedCount = initialCount - database.sessions.length;

    return {
      database,
      data: cleanedCount,
    };
  });
}
