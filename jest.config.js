const defineJestConfig = require('@tarojs/test-utils-react/dist/jest.js').default

module.exports = defineJestConfig({
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.(spec|test).[jt]s?(x)']
})
