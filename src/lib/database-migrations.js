import { DEFAULT_DATABASE, readDatabase, writeDatabase } from './database.js';

/**
 * Database migration utilities
 */

const CURRENT_VERSION = '1.0.0';

/**
 * Runs all necessary migrations to bring database to current version
 * @returns {Promise<Object>} Migration result
 */
export async function runMigrations() {
  try {
    const database = await readDatabase();
    const currentVersion = database.metadata?.version || '0.0.0';

    if (currentVersion === CURRENT_VERSION) {
      return {
        success: true,
        message: 'Database is already up to date',
        version: currentVersion,
      };
    }

    const migrations = getMigrationsToRun(currentVersion);
    let migratedDatabase = { ...database };

    for (const migration of migrations) {
      console.log(`Running migration: ${migration.version}`);
      migratedDatabase = await migration.migrate(migratedDatabase);
      migratedDatabase.metadata.version = migration.version;
    }

    await writeDatabase(migratedDatabase);

    return {
      success: true,
      message: `Database migrated from ${currentVersion} to ${CURRENT_VERSION}`,
      version: CURRENT_VERSION,
      migrationsRun: migrations.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `Migration failed: ${error.message}`,
      error: error.message,
    };
  }
}

/**
 * Gets list of migrations to run based on current version
 * @param {string} currentVersion - Current database version
 * @returns {Array} Array of migration objects
 */
function getMigrationsToRun(currentVersion) {
  const migrations = [
    {
      version: '1.0.0',
      description: 'Initial database structure',
      migrate: migration_1_0_0,
    },
  ];

  return migrations.filter((migration) => {
    return compareVersions(migration.version, currentVersion) > 0;
  });
}

/**
 * Compares two version strings
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {number} -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
function compareVersions(version1, version2) {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }

  return 0;
}

/**
 * Migration to version 1.0.0 - Initial database structure
 * @param {Object} database - Current database
 * @returns {Promise<Object>} Migrated database
 */
async function migration_1_0_0(database) {
  // Ensure all required collections exist
  const migratedDatabase = {
    users: database.users || [],
    items: database.items || [],
    sessions: database.sessions || [],
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      ...database.metadata,
    },
  };

  // Ensure all users have required fields
  migratedDatabase.users = migratedDatabase.users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image || null,
    role: user.role || 'user',
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString(),
  }));

  // Ensure all items have required fields
  migratedDatabase.items = migratedDatabase.items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image || null,
    category: item.category || null,
    inStock: item.inStock !== undefined ? item.inStock : true,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    createdBy: item.createdBy || null,
  }));

  // Ensure all sessions have required fields
  migratedDatabase.sessions = migratedDatabase.sessions.map((session) => ({
    id: session.id,
    userId: session.userId,
    sessionToken: session.sessionToken,
    expires: session.expires,
    createdAt: session.createdAt || new Date().toISOString(),
  }));

  return migratedDatabase;
}

/**
 * Creates a backup of the current database
 * @returns {Promise<string>} Backup file path
 */
export async function createBackup() {
  try {
    const database = await readDatabase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `data/backup-${timestamp}.json`;

    await writeDatabase(database, backupPath);

    return {
      success: true,
      backupPath,
      message: `Backup created at ${backupPath}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Backup failed: ${error.message}`,
      error: error.message,
    };
  }
}

/**
 * Restores database from a backup file
 * @param {string} backupPath - Path to backup file
 * @returns {Promise<Object>} Restore result
 */
export async function restoreFromBackup(backupPath) {
  try {
    const fs = await import('fs/promises');
    const backupData = await fs.readFile(backupPath, 'utf8');
    const backupDatabase = JSON.parse(backupData);

    // Validate backup structure
    if (
      !backupDatabase.users ||
      !backupDatabase.items ||
      !backupDatabase.sessions
    ) {
      throw new Error('Invalid backup file structure');
    }

    await writeDatabase(backupDatabase);

    return {
      success: true,
      message: `Database restored from ${backupPath}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Restore failed: ${error.message}`,
      error: error.message,
    };
  }
}

/**
 * Resets database to default state
 * @returns {Promise<Object>} Reset result
 */
export async function resetDatabase() {
  try {
    await writeDatabase(DEFAULT_DATABASE);

    return {
      success: true,
      message: 'Database reset to default state',
    };
  } catch (error) {
    return {
      success: false,
      message: `Reset failed: ${error.message}`,
      error: error.message,
    };
  }
}
