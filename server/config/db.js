const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodInstance = null;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] MongoDB Connected to external instance: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[Database] Failed to connect to MONGODB_URI (${err.message}). Falling back to embedded MongoDB...`);
    }
  }

  try {
    const dbDir = path.join(__dirname, '..', '.dbdata');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Safely remove stale lock files if previous process exited abruptly
    const cleanLocks = () => {
      ['mongod.lock', 'WiredTiger.lock'].forEach((f) => {
        const fp = path.join(dbDir, f);
        if (fs.existsSync(fp)) {
          try {
            fs.unlinkSync(fp);
            console.log(`[Database] Cleared stale lock: ${f}`);
          } catch (_) {}
        }
      });
    };

    cleanLocks();

    console.log('[Database] Starting persistent embedded MongoDB server...');
    try {
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbPath: dbDir,
          launchTimeout: 30000,
          dbName: 'taskflow'
        }
      });
    } catch (createErr) {
      console.warn(`[Database] Persistent storage warning: ${createErr.message}. Recovering...`);
      cleanLocks();
      // Retry once after cleaning locks
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'taskflow'
        }
      });
    }

    const memoryUri = mongodInstance.getUri('taskflow');
    const conn = await mongoose.connect(memoryUri, { dbName: 'taskflow' });
    console.log(`[Database] Persistent Embedded MongoDB Server Connected: ${memoryUri}`);
  } catch (error) {
    console.error(`[Database] Fatal MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongodInstance) {
      await mongodInstance.stop({ doCleanup: false });
    }
  } catch (err) {
    console.error('Error during DB disconnect:', err.message);
  }
};

// Graceful cleanup on server stop or watch restarts
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
