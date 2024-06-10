module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
<<<<<<< ft-update-order
  verbose: true,
  forceExit: true,
  clearMocks: true,
=======
  setupFilesAfterEnv: ["./jest.config.js"],
  verbose: true,
  forceExit: true,
  clearMocks: true
>>>>>>> friday-demo-31-05
};
