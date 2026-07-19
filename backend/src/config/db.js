const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      const uri = process.env.MONGO_URI;
      const useMemoryDb =
        !uri ||
        uri.includes('your_mongo_uri') ||
        uri.includes('localhost:27017') ||
        uri.includes('127.0.0.1:27017');

      if (useMemoryDb) {
        if (!mongoServer) {
          mongoServer = await MongoMemoryServer.create();
        }

        const memoryUri = mongoServer.getUri();
        await mongoose.connect(memoryUri, { dbName: 'team-collaboration-board' });
        console.log('MongoDB connected to in-memory server');
        return;
      }

      await mongoose.connect(uri, { dbName: 'team-collaboration-board' });
      console.log('MongoDB connected');
    })();
  }

  return connectionPromise;
}

module.exports = connectDB;
