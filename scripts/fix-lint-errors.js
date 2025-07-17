#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting automated lint fixes...');

// Function to fix common linting issues
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix unescaped entities
    const entityFixes = [
      { from: /'/g, to: '&apos;' },
      { from: /"/g, to: '&quot;' }
    ];

    // Only apply entity fixes in JSX content (between > and <)
    content = content.replace(/>([^<]*['""][^<]*)</g, (match, textContent) => {
      let fixed = textContent;
      entityFixes.forEach(fix => {
        if (fixed.includes(fix.from.source.replace(/[\\\/]/g, ''))) {
          fixed = fixed.replace(fix.from, fix.to);
          modified = true;
        }
      });
      return `>${fixed}<`;
    });

    // Fix prefer-const issues
    content = content.replace(/let (\w+) = ([^;]+);(\s*)(?!.*\1\s*=)/gm, (match, varName, value, whitespace) => {
      // Only replace if the variable is not reassigned later
      const reassignmentRegex = new RegExp(`\\b${varName}\\s*=`, 'g');
      const matches = content.match(reassignmentRegex);
      if (!matches || matches.length === 1) {
        modified = true;
        return `const ${varName} = ${value};${whitespace}`;
      }
      return match;
    });

    // Remove unused imports (simple cases)
    const unusedImportPatterns = [
      /import\s+{\s*[^}]*\b(\w+)\b[^}]*}\s+from\s+['""][^'""]+"['""];?\s*\n/g
    ];

    // Fix empty object type interfaces
    content = content.replace(/interface\s+(\w+)\s+extends\s+([^{]+)\s*{\s*}/g, 'type $1 = $2');

    // Fix any types to unknown (safer default)
    content = content.replace(/:\s*any\b/g, ': unknown');
    content = content.replace(/Unexpected any\. Specify a different type\./g, '');

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
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
  
  // Run ESLint with --fix flag
  console.log('\n🔧 Running ESLint --fix...');
  try {
    execSync('npm run lint -- --fix', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ ESLint --fix completed');
  } catch (error) {
    console.log('⚠️  ESLint --fix completed with some remaining issues');
  }
  
} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}