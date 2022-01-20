/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./tests/setupTests.ts"],
  transform: {
    ".css$": "<rootDir>/tests/mocks/identityMock.js",
  },
};
