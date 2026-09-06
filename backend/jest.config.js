/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  setupFiles: ["dotenv/config", "<rootDir>/tests/utils/setupEnv.ts"],
  testTimeout: 15000,
};