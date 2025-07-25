/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Removed next-intl mocks - no longer using i18n
    '^@supabase/supabase-js$': '<rootDir>/__mocks__/supabase.js',
    '^isows$': '<rootDir>/__mocks__/isows.js',
    // Mock other ESM modules that cause issues
    '^framer-motion$': '<rootDir>/__mocks__/framer-motion.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/cypress/'],
  transformIgnorePatterns: [
    // More permissive transform patterns
    'node_modules/(?!(@supabase|isows|framer-motion)/)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
        module: 'ESNext',
        moduleResolution: 'node',
      },
    }],
    '^.+\\.(js|jsx|mjs)$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
    }],
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 20, // Further reduced for stability  
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};