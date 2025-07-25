#!/usr/bin/env node

/**
 * Test Verification Script
 * 
 * This script verifies that all test files are properly set up
 * and can be executed. It doesn't run the actual tests but checks
 * that the files exist and have the correct structure.
 */

const fs = require('fs');
const path = require('path');

// Test files to verify
const testFiles = [
  'src/lib/__tests__/integration/final-integration.test.tsx',
  'src/lib/__tests__/security/comprehensive-security.test.ts',
  'src/lib/__tests__/performance/performance.test.ts',
  'cypress/e2e/integration/final-system-integration.cy.ts'
];

// Required files for the tests to work
const requiredFiles = [
  'src/lib/supabase.ts',
  'src/lib/validations.ts',
  'src/lib/security.ts',
  'scripts/run-integration-tests.js'
];

// Check if files exist
function checkFiles(files) {
  const missing = [];
  
  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      missing.push(file);
    }
  }
  
  return missing;
}

// Main verification function
function verifyTests() {
  console.log('Verifying test files...');
  
  // Check test files
  const missingTests = checkFiles(testFiles);
  if (missingTests.length > 0) {
    console.error('❌ Missing test files:');
    missingTests.forEach(file => console.error(`  - ${file}`));
  } else {
    console.log('✅ All test files are present');
  }
  
  // Check required files
  const missingRequired = checkFiles(requiredFiles);
  if (missingRequired.length > 0) {
    console.error('❌ Missing required files:');
    missingRequired.forEach(file => console.error(`  - ${file}`));
  } else {
    console.log('✅ All required files are present');
  }
  
  // Check test content
  console.log('\nVerifying test content...');
  
  for (const file of testFiles) {
    if (missingTests.includes(file)) continue;
    
    const filePath = path.join(process.cwd(), file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for describe blocks
    const hasDescribe = content.includes('describe(');
    // Check for test/it blocks
    const hasTests = content.includes('test(') || content.includes('it(');
    // Check for expect assertions
    const hasAssertions = content.includes('expect(');
    
    if (!hasDescribe || !hasTests || !hasAssertions) {
      console.error(`❌ ${file} is missing required test structure`);
      if (!hasDescribe) console.error('  - Missing describe blocks');
      if (!hasTests) console.error('  - Missing test/it blocks');
      if (!hasAssertions) console.error('  - Missing expect assertions');
    } else {
      console.log(`✅ ${file} has correct test structure`);
    }
  }
  
  console.log('\nVerification complete!');
  
  // Check if all tests are ready
  const allTestsReady = missingTests.length === 0 && missingRequired.length === 0;
  if (allTestsReady) {
    console.log('\n🎉 All tests are properly set up and ready to run!');
    console.log('\nTo run the tests, use:');
    console.log('  node scripts/run-integration-tests.js');
  } else {
    console.error('\n❌ Some tests are not properly set up. Please fix the issues above.');
  }
}

// Run verification
verifyTests();