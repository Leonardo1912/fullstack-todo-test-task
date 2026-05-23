/** @type {import("jest").Config} */
const config = {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts"]
};

module.exports = config;
