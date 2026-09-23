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
    console.log('[Database] Starting embedded MongoDB server...');
    mongodInstance = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 30000,
        dbName: 'taskflow'
      }
    });
    const memoryUri = mongodInstance.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] Embedded MongoDB Server Connected: ${memoryUri}`);
  } catch (error) {
    console.error(`[Database] Fatal MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('Error during DB disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
