#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Converting Chai-style assertions to Jest assertions...');

// Files to fix
const testFiles = [
  'src/lib/__tests__/security/comprehensive-security.test.ts',
  'src/lib/__tests__/security/security-integration.test.tsx'
];

function fixAssertions(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  try {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Convert Chai-style assertions to Jest assertions
    const conversions = [
      // Basic equality
      { from: /\.to\.equal\(/g, to: '.toBe(' },
      { from: /\.to\.be\.equal\(/g, to: '.toBe(' },
      
      // Deep equality
      { from: /\.to\.deep\.equal\(/g, to: '.toEqual(' },
      { from: /\.to\.eql\(/g, to: '.toEqual(' },
      
      // Negations
      { from: /\.not\.to\.equal\(/g, to: '.not.toBe(' },
      { from: /\.not\.to\.contain\(/g, to: '.not.toContain(' },
      { from: /\.not\.to\.throw\(\)/g, to: '.not.toThrow()' },
      { from: /\.not\.to\.be\.equal\(/g, to: '.not.toBe(' },
      
      // Contains/includes
      { from: /\.to\.contain\(/g, to: '.toContain(' },
      { from: /\.to\.include\(/g, to: '.toContain(' },
      
      // Match patterns
      { from: /\.to\.match\(/g, to: '.toMatch(' },
      
      // Throw errors
      { from: /\.to\.throw\(\)/g, to: '.toThrow()' },
      { from: /\.to\.throw\(/g, to: '.toThrow(' },
      
      // Boolean checks
      { from: /\.to\.be\.true/g, to: '.toBe(true)' },
      { from: /\.to\.be\.false/g, to: '.toBe(false)' },
      
      // Null/undefined checks
      { from: /\.to\.be\.null/g, to: '.toBeNull()' },
      { from: /\.to\.be\.undefined/g, to: '.toBeUndefined()' },
      { from: /\.not\.to\.be\.null/g, to: '.not.toBeNull()' },
      { from: /\.not\.to\.be\.undefined/g, to: '.not.toBeUndefined()' },
      
      // Length checks
      { from: /\.to\.have\.length\(/g, to: '.toHaveLength(' },
      
      // Property checks
      { from: /\.to\.have\.property\(/g, to: '.toHaveProperty(' },
    ];

    conversions.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    // Fix mock-related issues
    if (filePath.includes('security-integration.test.tsx')) {
      // Add proper mock setup
      const mockSetup = `
// Mock functions
const mockValidateInput = jest.fn();
const mockSanitizeInput = jest.fn();

// Mock modules
jest.mock('@/lib/validations', () => ({
  validateInput: mockValidateInput,
  sanitizeInput: mockSanitizeInput,
  validateEmail: jest.fn(),
  validatePhone: jest.fn(),
}));

jest.mock('isomorphic-dompurify', () => ({
  sanitize: jest.fn((input) => input.replace(/<script.*?<\\/script>/gi, '')),
}));
`;

      if (!content.includes('Mock functions')) {
        // Insert mock setup after imports
        const importEndIndex = content.lastIndexOf('import');
        const nextLineIndex = content.indexOf('\n', importEndIndex);
        content = content.slice(0, nextLineIndex + 1) + mockSetup + content.slice(nextLineIndex + 1);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed assertions in: ${filePath}`);
    } else {
      console.log(`⚠️ No changes needed for: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Process all test files
testFiles.forEach(fixAssertions);

console.log('\\n✨ Test assertion fixes completed!');