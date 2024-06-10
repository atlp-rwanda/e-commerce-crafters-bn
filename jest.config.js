module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.config.js"],
  verbose: true,
  forceExit: true,
  clearMocks: true
};
