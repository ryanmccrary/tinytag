module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['tests/**/*.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};