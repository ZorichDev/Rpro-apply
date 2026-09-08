// Runs once before the test suite and wraps every test with a clean
// database. Uses mongodb-memory-server so tests don't need a real
// MongoDB running anywhere — a real mongod binary is downloaded once
// (network-dependent, only on first run) and run in-memory from then on.
//
// IMPORTANT: env vars must be set before any test file imports anything
// from src/ — config/env.ts reads them at module-load time and throws if
// they're missing. setupFilesAfterEnv runs before test files are
// imported, so this ordering is safe.
process.env.JWT_ACCESS_SECRET = "test-access-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.NODE_ENV = "test";

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  // Clear all collections between tests so one test's data never leaks
  // into another — each test starts from a genuinely empty database.
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
