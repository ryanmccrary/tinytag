module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};