#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting comprehensive lint fixes...');

// Function to fix specific linting issues
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // 1. Fix unescaped entities in JSX text content only
    content = content.replace(/>([^<]*['""][^<]*)</g, (match, textContent) => {
      // Skip if it looks like code or contains JSX expressions
      if (textContent.includes('{') || 
          textContent.includes('}') ||
          textContent.includes('$') ||
          textContent.includes('await') || 
          textContent.includes('fetch') || 
          textContent.includes('const') ||
          textContent.includes('let') ||
          textContent.includes('var') ||
          textContent.includes('function') ||
          textContent.includes('return') ||
          textContent.includes('import') ||
          textContent.includes('export') ||
          textContent.includes('=') ||
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
          textContent.includes('.js') ||
          textContent.includes('className') ||
          textContent.includes('onClick') ||
          textContent.includes('onChange')) {
        return match;
      }
      
      // Only fix actual text content
      let fixed = textContent
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
      
      if (fixed !== textContent) {
        modified = true;
      }
      return `>${fixed}<`;
    });

    // 2. Fix prefer-const issues
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const letMatch = line.match(/^(\s*)let\s+(\w+)\s*=\s*([^;]+);?\s*$/);
      if (letMatch) {
        const [, indent, varName, value] = letMatch;
        // Check if variable is reassigned later
        const restOfFile = lines.slice(i + 1).join('\n');
        const reassignRegex = new RegExp(`\\b${varName}\\s*=(?!=)`, 'g');
        if (!reassignRegex.test(restOfFile)) {
          lines[i] = `${indent}const ${varName} = ${value};`;
          modified = true;
        }
      }
    }
    content = lines.join('\n');

    // 3. Fix empty object type interfaces
    content = content.replace(
      /interface\s+(\w+Props?)\s+extends\s+([^{]+)\s*{\s*}/g,
      'type $1 = $2'
    );
    if (content !== originalContent && !modified) modified = true;

    // 4. Remove unused imports (simple cases)
    const importRegex = /import\s+{\s*([^}]+)\s*}\s+from\s+['"']([^'"']+)['"'];?\s*\n/g;
    let importMatch;
    const imports = [];
    
    while ((importMatch = importRegex.exec(content)) !== null) {
      const [fullMatch, importList, moduleName] = importMatch;
      const importNames = importList.split(',').map(name => name.trim());
      const usedImports = [];
      
      for (const importName of importNames) {
        const cleanName = importName.replace(/\s+as\s+\w+/, '').trim();
        const usageRegex = new RegExp(`\\b${cleanName}\\b`, 'g');
        const contentWithoutImport = content.replace(fullMatch, '');
        
        if (usageRegex.test(contentWithoutImport)) {
          usedImports.push(importName);
        }
      }
      
      if (usedImports.length === 0) {
        // Remove entire import
        content = content.replace(fullMatch, '');
        modified = true;
      } else if (usedImports.length < importNames.length) {
        // Keep only used imports
        const newImport = `import { ${usedImports.join(', ')} } from '${moduleName}';\n`;
        content = content.replace(fullMatch, newImport);
        modified = true;
      }
    }

    // 5. Fix specific any types to more appropriate types
    const anyReplacements = [
      { pattern: /:\s*any\[\]/g, replacement: ': unknown[]' },
      { pattern: /:\s*any\s*=/g, replacement: ': unknown =' },
      { pattern: /:\s*any\s*\)/g, replacement: ': unknown)' },
      { pattern: /:\s*any\s*,/g, replacement: ': unknown,' },
      { pattern: /:\s*any\s*;/g, replacement: ': unknown;' },
      { pattern: /:\s*any\s*\|/g, replacement: ': unknown |' },
      { pattern: /\|\s*any\s*$/gm, replacement: '| unknown' },
      { pattern: /\|\s*any\s*\)/g, replacement: '| unknown)' },
      { pattern: /\|\s*any\s*,/g, replacement: '| unknown,' },
      { pattern: /\|\s*any\s*;/g, replacement: '| unknown;' }
    ];

    anyReplacements.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // 6. Remove unused variables (simple cases)
    const unusedVarRegex = /^\s*const\s+(\w+)\s*=\s*[^;]+;\s*$/gm;
    let varMatch;
    const varsToCheck = [];
    
    while ((varMatch = unusedVarRegex.exec(content)) !== null) {
      varsToCheck.push({
        match: varMatch[0],
        varName: varMatch[1],
        index: varMatch.index
      });
    }
    
    for (const varInfo of varsToCheck.reverse()) { // Reverse to handle indices correctly
      const usageRegex = new RegExp(`\\b${varInfo.varName}\\b`, 'g');
      const contentWithoutDeclaration = content.substring(0, varInfo.index) + 
                                       content.substring(varInfo.index + varInfo.match.length);
      
      if (!usageRegex.test(contentWithoutDeclaration)) {
        content = content.substring(0, varInfo.index) + 
                 content.substring(varInfo.index + varInfo.match.length);
        modified = true;
      }
    }

    // 7. Fix parsing errors by removing trailing commas in specific contexts
    content = content.replace(/,(\s*[}\]])/g, '$1');
    if (content !== originalContent && !modified) modified = true;

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
  try {
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
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
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
  
  // Run ESLint with --fix flag to handle remaining auto-fixable issues
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