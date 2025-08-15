// Jest setup file - runs before each test file
// This is useful for global test configuration

// Set test environment variables
process.env.NODE_ENV = 'test';

// Extend Jest matchers if needed
// import { toHaveNoViolations } from 'jest-axe';
// expect.extend(toHaveNoViolations);

// Global test helpers
global.testHelper = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  randomString: () => Math.random().toString(36).substring(7),
  randomNumber: (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min,
  randomEmail: () => `test-${Math.random().toString(36).substring(7)}@example.com`
};

// Mock console methods to reduce test output noise (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Setup fake timers if needed
// jest.useFakeTimers();

// Configure test database or other resources
beforeAll(async () => {
  // Global setup for all tests
  console.log('🧪 Starting test suite...');
});

afterAll(async () => {
  // Global cleanup for all tests
  console.log('✅ Test suite completed!');
});

// Configure test timeouts
jest.setTimeout(30000); // 30 seconds

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in tests
});

// Suppress specific warnings if needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
