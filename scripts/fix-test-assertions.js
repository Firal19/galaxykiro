#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing test assertions in security test files...');

// Files with assertion issues
const filesToFix = [
  'src/lib/__tests__/security/comprehensive-security.test.ts',
  'src/lib/__tests__/security/security-integration.test.ts'
];

// Function to fix Jest-style assertions to Chai-style assertions
function fixAssertions(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  try {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace Jest-style assertions with Chai-style assertions
    const replacements = [
      { from: /\.toBe\(/g, to: '.to.equal(' },
      { from: /\.toEqual\(/g, to: '.to.deep.equal(' },
      { from: /\.toContain\(/g, to: '.to.contain(' },
      { from: /\.toMatch\(/g, to: '.to.match(' },
      { from: /\.not\.toContain\(/g, to: '.not.to.contain(' },
      { from: /\.not\.toBe\(/g, to: '.not.to.equal(' },
      { from: /\.not\.toEqual\(/g, to: '.not.to.deep.equal(' },
      { from: /\.not\.toMatch\(/g, to: '.not.to.match(' },
      { from: /\.toThrow\(/g, to: '.to.throw(' },
      { from: /\.not\.toThrow\(/g, to: '.not.to.throw(' }
    ];

    replacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed assertions in: ${filePath}`);
    } else {
      console.log(`⚠️ No assertions to fix in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Process all files
filesToFix.forEach(fixAssertions);

console.log('\\n✨ Test assertion fixes completed!');