module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  moduleNameMapper: {
    '^@actions/core$': '<rootDir>/__tests__/mocks/actions-core.ts',
    '^@actions/exec$': '<rootDir>/__tests__/mocks/actions-exec.ts',
    '^@actions/io$': '<rootDir>/__tests__/mocks/actions-io.ts',
    '^@actions/tool-cache$': '<rootDir>/__tests__/mocks/actions-tool-cache.ts',
    '^node-fetch$': '<rootDir>/__tests__/mocks/node-fetch.ts'
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          types: ['jest', 'node']
        }
      }
    ]
  },
  verbose: true
}
