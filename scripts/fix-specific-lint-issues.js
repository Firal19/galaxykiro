#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing specific lint issues...');

// Function to fix specific linting issues
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix unescaped entities only in JSX text content (between > and < that doesn't contain code)
    content = content.replace(/>([^<]*['""][^<]*)</g, (match, textContent) => {
      // Skip if it looks like code (contains common code patterns)
      if (textContent.includes('await') || 
          textContent.includes('fetch') || 
          textContent.includes('const') ||
          textContent.includes('let') ||
          textContent.includes('var') ||
          textContent.includes('function') ||
          textContent.includes('return') ||
          textContent.includes('import') ||
          textContent.includes('export') ||
          textContent.includes('=') ||
          textContent.includes('{') ||
          textContent.includes('}') ||
          textContent.includes('[') ||
          textContent.includes(']') ||
          textContent.includes('(') ||
          textContent.includes(')') ||
          textContent.includes('/') ||
          textContent.includes('\\') ||
          textContent.includes('api') ||
          textContent.includes('http') ||
          textContent.includes('www') ||
          textContent.includes('.com') ||
          textContent.includes('.json') ||
          textContent.includes('.ts') ||
          textContent.includes('.js')) {
        return match;
      }
      
      // Only fix actual text content
      let fixed = textContent
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
      modified = true;
      return `>${fixed}<`;
    });

    // Fix prefer-const for simple variable declarations
    content = content.replace(/^(\s*)let\s+(\w+)\s*=\s*([^;]+);?\s*$/gm, (match, indent, varName, value) => {
      // Check if variable is reassigned later in the file
      const restOfFile = content.substring(content.indexOf(match) + match.length);
      const reassignRegex = new RegExp(`\\b${varName}\\s*=`, 'g');
      if (!reassignRegex.test(restOfFile)) {
        modified = true;
        return `${indent}const ${varName} = ${value};`;
      }
      return match;
    });

    // Fix empty object type interfaces
    if (content.includes('interface') && content.includes('extends') && content.includes('{}')) {
      content = content.replace(/interface\s+(\w+Props)\s+extends\s+([^{]+)\s*{\s*}/g, 'type $1 = $2');
      modified = true;
    }

    // Remove unused imports (simple cases only)
    const lines = content.split('\n');
    const importLines = lines.filter(line => line.trim().startsWith('import'));
    const codeContent = lines.filter(line => !line.trim().startsWith('import')).join('\n');
    
    for (const importLine of importLines) {
      const importMatch = importLine.match(/import\s+.*?{\s*([^}]+)\s*}\s+from/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(imp => imp.trim());
        const unusedImports = imports.filter(imp => {
          const regex = new RegExp(`\\b${imp}\\b`, 'g');
          return !regex.test(codeContent);
        });
        
        if (unusedImports.length > 0 && unusedImports.length < imports.length) {
          const usedImports = imports.filter(imp => !unusedImports.includes(imp));
          const newImportLine = importLine.replace(
            /{\s*[^}]+\s*}/,
            `{ ${usedImports.join(', ')} }`
          );
          content = content.replace(importLine, newImportLine);
          modified = true;
        } else if (unusedImports.length === imports.length) {
          // Remove entire import line if all imports are unused
          content = content.replace(importLine + '\n', '');
          modified = true;
        }
      }
    }

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