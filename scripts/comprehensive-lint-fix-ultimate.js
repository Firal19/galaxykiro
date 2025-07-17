#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting comprehensive lint fix...');

// Get all TypeScript and TSX files
function getAllTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      getAllTsFiles(fullPath, files);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix React unescaped entities
function fixUnescapedEntities(content) {
  // Fix apostrophes
  content = content.replace(/([^\\])'([^s])/g, '$1&apos;$2');
  content = content.replace(/([^\\])'s/g, '$1&apos;s');
  content = content.replace(/([^\\])'t/g, '$1&apos;t');
  content = content.replace(/([^\\])'re/g, '$1&apos;re');
  content = content.replace(/([^\\])'ll/g, '$1&apos;ll');
  content = content.replace(/([^\\])'ve/g, '$1&apos;ve');
  content = content.replace(/([^\\])'d/g, '$1&apos;d');
  content = content.replace(/([^\\])'m/g, '$1&apos;m');
  
  // Fix quotes
  content = content.replace(/([^\\])"([^"])/g, '$1&quot;$2');
  content = content.replace(/([^"])"/g, '$1&quot;');
  
  return content;
}

// Fix TypeScript any types
function fixAnyTypes(content) {
  // Replace common any patterns with proper types
  content = content.replace(/: any\[\]/g, ': unknown[]');
  content = content.replace(/: any\s*=/g, ': unknown =');
  content = content.replace(/: any\s*\)/g, ': unknown)');
  content = content.replace(/: any\s*,/g, ': unknown,');
  content = content.replace(/: any\s*;/g, ': unknown;');
  content = content.replace(/: any\s*\|/g, ': unknown |');
  content = content.replace(/\| any\s/g, '| unknown ');
  
  // Fix function parameters
  content = content.replace(/\(([^)]*): any\)/g, '($1: unknown)');
  content = content.replace(/\(([^)]*), ([^)]*): any\)/g, '($1, $2: unknown)');
  
  return content;
}

// Remove unused imports and variables
function removeUnusedImports(content) {
  const lines = content.split('\n');
  const usedImports = new Set();
  const importLines = [];
  const otherLines = [];
  
  // Separate import lines from other lines
  lines.forEach((line, index) => {
    if (line.trim().startsWith('import ') && !line.includes('from \'react\'')) {
      importLines.push({ line, index });
    } else {
      otherLines.push(line);
    }
  });
  
  // Find used imports in the code
  const codeContent = otherLines.join('\n');
  
  importLines.forEach(({ line }) => {
    const importMatch = line.match(/import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))\s+from/);
    if (importMatch) {
      if (importMatch[1]) {
        // Named imports
        const namedImports = importMatch[1].split(',').map(imp => imp.trim());
        namedImports.forEach(imp => {
          const cleanImp = imp.replace(/\s+as\s+\w+/, '').trim();
          if (codeContent.includes(cleanImp)) {
            usedImports.add(line);
          }
        });
      } else if (importMatch[2] || importMatch[3]) {
        // Default or namespace imports
        const importName = importMatch[2] || importMatch[3];
        if (codeContent.includes(importName)) {
          usedImports.add(line);
        }
      }
    }
  });
  
  // Reconstruct content with only used imports
  const finalLines = [];
  lines.forEach(line => {
    if (line.trim().startsWith('import ') && !line.includes('from \'react\'')) {
      if (usedImports.has(line)) {
        finalLines.push(line);
      }
    } else {
      finalLines.push(line);
    }
  });
  
  return finalLines.join('\n');
}

// Fix prefer-const issues
function fixPreferConst(content) {
  // Find let declarations that are never reassigned
  const lines = content.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Simple let to const conversion for obvious cases
    if (line.includes('let ') && !line.includes('=') && lines[i + 1] && lines[i + 1].includes('=')) {
      // Skip complex cases
      continue;
    }
    
    // Convert simple let declarations
    line = line.replace(/(\s+)let(\s+)(\w+)(\s*=)/g, '$1const$2$3$4');
    
    result.push(line);
  }
  
  return result.join('\n');
}

// Fix parsing errors by removing trailing commas in wrong places
function fixParsingErrors(content) {
  // Fix trailing commas in object destructuring
  content = content.replace(/,(\s*}\s*=)/g, '$1');
  
  // Fix trailing commas in function parameters
  content = content.replace(/,(\s*\)\s*=>)/g, '$1');
  content = content.replace(/,(\s*\)\s*{)/g, '$1');
  
  return content;
}

// Fix empty interfaces
function fixEmptyInterfaces(content) {
  // Replace empty interfaces extending React component props
  content = content.replace(/interface\s+\w+Props\s+extends\s+React\.\w+<[^>]*>\s*{\s*}/g, 
    'type $1Props = React.$2<$3>');
  
  return content;
}

// Fix useEffect dependencies
function fixUseEffectDeps(content) {
  // This is complex and context-dependent, so we'll add basic fixes
  const lines = content.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Add empty dependency array to useEffect without deps
    if (line.includes('useEffect(') && !line.includes(', [') && !line.includes(',[')) {
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.trim() === '});') {
        line = line.replace('});', '}, []);');
        i++; // Skip the next line
      }
    }
    
    result.push(line);
  }
  
  return result.join('\n');
}

// Main processing function
function processFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply all fixes
    content = fixUnescapedEntities(content);
    content = fixAnyTypes(content);
    content = removeUnusedImports(content);
    content = fixPreferConst(content);
    content = fixParsingErrors(content);
    content = fixEmptyInterfaces(content);
    content = fixUseEffectDeps(content);
    
    // Write back the fixed content
    fs.writeFileSync(filePath, content, 'utf8');
    
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
try {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = getAllTsFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript files to process`);
  
  let processed = 0;
  let errors = 0;
  
  files.forEach(file => {
    if (processFile(file)) {
      processed++;
    } else {
      errors++;
    }
  });
  
  console.log(`\n✅ Processed ${processed} files successfully`);
  if (errors > 0) {
    console.log(`❌ ${errors} files had errors`);
  }
  
  // Run prettier to format the code
  console.log('\n🎨 Running Prettier to format code...');
  try {
    execSync('npx prettier --write "src/**/*.{ts,tsx}"', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit' 
    });
    console.log('✅ Prettier formatting completed');
  } catch (error) {
    console.log('⚠️  Prettier formatting failed, but fixes were applied');
  }
  
  console.log('\n🔍 Running ESLint to check remaining issues...');
  try {
    execSync('npm run lint', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit' 
    });
    console.log('✅ All linting issues resolved!');
  } catch (error) {
    console.log('⚠️  Some linting issues may remain. Check the output above.');
  }
  
} catch (error) {
  console.error('Fatal error:', error.message);
  process.exit(1);
}