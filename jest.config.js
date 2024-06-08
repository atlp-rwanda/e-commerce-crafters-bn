module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.config.js'], // Assuming the setup file is called jest.setup.js
  verbose: true,
  clearMocks: true,
  forceExit: true
};
