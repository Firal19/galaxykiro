#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting targeted lint fixes...');

// Function to revert problematic changes and apply targeted fixes
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Revert problematic entity replacements in code
    content = content.replace(/&apos;/g, "'");
    content = content.replace(/&quot;/g, '"');

    // Fix unescaped entities only in JSX text content (not in attributes or code)
    content = content.replace(/>([^<]*['"][^<]*)</g, (match, textContent) => {
      if (textContent.includes("'") || textContent.includes('"')) {
        let fixed = textContent
          .replace(/'/g, '&apos;')
          .replace(/"/g, '&quot;');
        modified = true;
        return `>${fixed}<`;
      }
      return match;
    });

    // Fix prefer-const for simple cases
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const letMatch = line.match(/^(\s*)let\s+(\w+)\s*=\s*([^;]+);?\s*$/);
      if (letMatch) {
        const [, indent, varName, value] = letMatch;
        // Check if variable is reassigned later
        const restOfFile = lines.slice(i + 1).join('\n');
        const reassignRegex = new RegExp(`\\b${varName}\\s*=`, 'g');
        if (!reassignRegex.test(restOfFile)) {
          lines[i] = `${indent}const ${varName} = ${value};`;
          modified = true;
        }
      }
    }
    
    if (modified) {
      content = lines.join('\n');
    }

    // Fix empty object type interfaces
    content = content.replace(
      /interface\s+(\w+Props)\s+extends\s+([^{]+)\s*{\s*}/g,
      'type $1 = $2'
    );

    // Remove unused variables (simple cases)
    content = content.replace(/\s*\/\*\s*eslint-disable.*?\*\/\s*/g, '');

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
  return false;
}

// Get all TypeScript/React files
function getAllTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      getAllTsFiles(fullPath, files);
    } else if (item.match(/\.(ts|tsx)$/)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
try {
  const srcDir = path.join(__dirname, '..', 'src');
  const tsFiles = getAllTsFiles(srcDir);
  
  console.log(`📁 Found ${tsFiles.length} TypeScript files`);
  
  let fixedCount = 0;
  for (const file of tsFiles) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} files`);
  
} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}