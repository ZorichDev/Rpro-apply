/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  // Tests can be genuinely slow the first time mongodb-memory-server
  // downloads its mongod binary — generous timeout so that download
  // doesn't get mistaken for a hung test.
  testTimeout: 30000,
  moduleNameMapper: {
    "^shared$": "<rootDir>/../shared/src/index.ts",
  },
};
