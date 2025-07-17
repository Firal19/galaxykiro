#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting safe lint fixes...');

// Function to safely fix specific linting issues
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;

    // 1. Fix unescaped entities in JSX text content only (very conservative)
    // Only fix simple cases where it's clearly text content
    content = content.replace(/>([^<{]*['""][^<{]*)</g, (match, textContent) => {
      // Skip if it contains any code-like patterns
      if (textContent.includes('{') || 
          textContent.includes('}') ||
          textContent.includes('$') ||
          textContent.includes('=') ||
          textContent.includes('(') ||
          textContent.includes(')') ||
          textContent.includes('[') ||
          textContent.includes(']') ||
          textContent.includes('/') ||
          textContent.includes('\\') ||
          textContent.includes('api') ||
          textContent.includes('http') ||
          textContent.includes('www') ||
          textContent.includes('.') ||
          textContent.includes('className') ||
          textContent.includes('onClick') ||
          textContent.includes('onChange') ||
          textContent.includes('href') ||
          textContent.includes('src') ||
          textContent.includes('alt') ||
          textContent.includes('id') ||
          textContent.includes('data-') ||
          textContent.includes('aria-') ||
          textContent.trim().length < 3) { // Skip very short strings
        return match;
      }
      
      // Only fix if it's clearly readable text
      if (/^[a-zA-Z\s'"",.\-!?:;]+$/.test(textContent.trim())) {
        let fixed = textContent
          .replace(/'/g, '&apos;')
          .replace(/"/g, '&quot;');
        
        if (fixed !== textContent) {
          modified = true;
        }
        return `>${fixed}<`;
      }
      
      return match;
    });

    // 2. Fix simple prefer-const cases (very conservative)
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Only fix very simple cases
      const letMatch = line.match(/^(\s*)let\s+(\w+)\s*=\s*([^;{}\[\]()]+);?\s*$/);
      if (letMatch && !letMatch[3].includes('await') && !letMatch[3].includes('fetch')) {
        const [, indent, varName, value] = letMatch;
        // Check if variable is reassigned later (simple check)
        const restOfFile = lines.slice(i + 1).join('\n');
        const reassignRegex = new RegExp(`\\b${varName}\\s*=(?!=)`, 'g');
        if (!reassignRegex.test(restOfFile)) {
          lines[i] = `${indent}const ${varName} = ${value};`;
          modified = true;
        }
      }
    }
    content = lines.join('\n');

    // 3. Remove unused simple imports (very conservative)
    const simpleUnusedImports = [
      { pattern: /import\s+{\s*Calendar\s*}\s+from\s+['"'][^'"']+['"'];?\s*\n/g, name: 'Calendar' },
      { pattern: /import\s+{\s*Clock\s*}\s+from\s+['"'][^'"']+['"'];?\s*\n/g, name: 'Clock' },
      { pattern: /import\s+{\s*Target\s*}\s+from\s+['"'][^'"']+['"'];?\s*\n/g, name: 'Target' },
      { pattern: /import\s+{\s*Share2\s*}\s+from\s+['"'][^'"']+['"'];?\s*\n/g, name: 'Share2' },
      { pattern: /import\s+{\s*Zap\s*}\s+from\s+['"'][^'"']+['"'];?\s*\n/g, name: 'Zap' }
    ];

    simpleUnusedImports.forEach(({ pattern, name }) => {
      const usageRegex = new RegExp(`\\b${name}\\b`, 'g');
      const contentWithoutImport = content.replace(pattern, '');
      
      if (!usageRegex.test(contentWithoutImport)) {
        const newContent = content.replace(pattern, '');
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    });

    // 4. Fix simple unused variables (very conservative)
    const unusedVarPatterns = [
      /^\s*const\s+err\s*=\s*[^;]+;\s*$/gm,
      /^\s*const\s+timeSpent\s*=\s*[^;]+;\s*$/gm,
      /^\s*const\s+router\s*=\s*useRouter\(\);\s*$/gm
    ];

    unusedVarPatterns.forEach(pattern => {
      const matches = [...content.matchAll(pattern)];
      matches.reverse().forEach(match => {
        const varName = match[0].match(/const\s+(\w+)/)[1];
        const usageRegex = new RegExp(`\\b${varName}\\b`, 'g');
        const contentWithoutDeclaration = content.replace(match[0], '');
        
        if (!usageRegex.test(contentWithoutDeclaration)) {
          content = content.replace(match[0], '');
          modified = true;
        }
      });
    });

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
  
  // Run ESLint with --fix flag for auto-fixable issues
  console.log('\n🔧 Running ESLint --fix for auto-fixable issues...');
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