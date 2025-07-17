#!/usr/bin/env node

/**
 * Comprehensive test runner script for the Progressive Engagement Website
 * This script runs all test suites and generates reports
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create reports directory if it doesn't exist
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Helper function to run a command and return a promise
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const proc = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// Run all tests
async function runAllTests() {
  try {
    // 1. Run unit tests
    console.log('\n=== Running Unit Tests ===\n');
    await runCommand('npm', ['test', '--', '--testPathPattern=unit']);
    
    // 2. Run accessibility tests
    console.log('\n=== Running Accessibility Tests ===\n');
    await runCommand('npm', ['test', '--', '--testPathPattern=a11y']);
    
    // 3. Run performance tests (only if server is running)
    console.log('\n=== Running Performance Tests ===\n');
    console.log('Note: Make sure the development server is running on http://localhost:3000');
    await runCommand('npm', ['test', '--', '--testPathPattern=performance']);
    
    // 4. Run end-to-end tests
    console.log('\n=== Running End-to-End Tests ===\n');
    console.log('Note: Make sure the development server is running on http://localhost:3000');
    await runCommand('npm', ['run', 'test:e2e']);
    
    console.log('\n=== All Tests Completed Successfully ===\n');
  } catch (error) {
    console.error('\n=== Test Execution Failed ===\n');
    console.error(error);
    process.exit(1);
  }
}

// Run specific test suite based on command line argument
async function runSpecificTests() {
  const testType = process.argv[2];
  
  try {
    switch (testType) {
      case 'unit':
        console.log('\n=== Running Unit Tests ===\n');
        await runCommand('npm', ['test', '--', '--testPathPattern=unit']);
        break;
        
      case 'a11y':
        console.log('\n=== Running Accessibility Tests ===\n');
        await runCommand('npm', ['test', '--', '--testPathPattern=a11y']);
        break;
        
      case 'performance':
        console.log('\n=== Running Performance Tests ===\n');
        console.log('Note: Make sure the development server is running on http://localhost:3000');
        await runCommand('npm', ['test', '--', '--testPathPattern=performance']);
        break;
        
      case 'e2e':
        console.log('\n=== Running End-to-End Tests ===\n');
        console.log('Note: Make sure the development server is running on http://localhost:3000');
        await runCommand('npm', ['run', 'test:e2e']);
        break;
        
      case 'integration':
        console.log('\n=== Running Integration Tests ===\n');
        console.log('Note: Make sure the development server is running on http://localhost:3000');
        await runCommand('npm', ['run', 'test:e2e', '--', '--spec', 'cypress/e2e/integration/**/*.cy.ts']);
        break;
        
      case 'conversion':
        console.log('\n=== Running Conversion Path Tests ===\n');
        console.log('Note: Make sure the development server is running on http://localhost:3000');
        await runCommand('npm', ['run', 'test:e2e', '--', '--spec', 'cypress/e2e/conversion/**/*.cy.ts']);
        break;
        
      default:
        console.error(`Unknown test type: ${testType}`);
        console.error('Available options: unit, a11y, performance, e2e, integration, conversion');
        process.exit(1);
    }
    
    console.log(`\n=== ${testType.toUpperCase()} Tests Completed Successfully ===\n`);
  } catch (error) {
    console.error(`\n=== ${testType.toUpperCase()} Test Execution Failed ===\n`);
    console.error(error);
    process.exit(1);
  }
}

// Main execution
if (process.argv.length > 2) {
  runSpecificTests();
} else {
  runAllTests();
}