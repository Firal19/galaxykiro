#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Final lint cleanup...');

// Function to fix remaining common issues
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix simple unused variables
    const simpleUnusedVars = [
      'Calendar', 'Clock', 'Target', 'Share2', 'Zap', 'CheckCircle', 
      'TrendingUp', 'Compass', 'LineChart', 'Line', 'useForm', 
      'zodResolver', 'Input', 'Tabs', 'TabsContent', 'TabsList', 
      'TabsTrigger', 'Save', 'Info', 'Select', 'SelectContent', 
      'SelectItem', 'SelectTrigger', 'SelectValue', 'useEffect',
      'AnimatePresence', 'ProgressiveForm', 'DynamicCTA'
    ];

    simpleUnusedVars.forEach(varName => {
      // Remove from import statements
      const importRegex = new RegExp(`import\\s+{[^}]*\\b${varName}\\b[^}]*}\\s+from\\s+['"'][^'"']+['"'];?\\s*\\n`, 'g');
      const newContent = content.replace(importRegex, (match) => {
        const imports = match.match(/{([^}]+)}/)[1];
        const importList = imports.split(',').map(imp => imp.trim()).filter(imp => !imp.includes(varName));
        
        if (importList.length === 0) {
          return ''; // Remove entire import
        } else {
          return match.replace(/{[^}]+}/, `{ ${importList.join(', ')} }`);
        }
      });
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // 2. Fix simple unused variable assignments
    const unusedAssignments = [
      'trackShare', 'membershipData', 'calendarDays', 'timeSpent', 
      'router', 'setSelectedTest', 'trackDisplay', 'score', 
      'readinessLevel', 'tCta', 'categoryColors', 'selectedCategory',
      'setSelectedCategory', 'getNextBenefit', 'registerSoftMember',
      'lockedBenefits', 'mockResults', 'user', 'leadScore', 
      'trackCTAClick', 'triggers', 'data', 'nameEQ'
    ];

    unusedAssignments.forEach(varName => {
      const assignmentRegex = new RegExp(`^\\s*const\\s+${varName}\\s*=\\s*[^;]+;?\\s*$`, 'gm');
      const newContent = content.replace(assignmentRegex, '');
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    // 3. Fix empty interface types
    content = content.replace(
      /interface\s+(\w+Props?)\s+extends\s+([^{]+)\s*{\s*}/g,
      'type $1 = $2'
    );

    // 4. Fix simple any types to unknown (conservative)
    const safeAnyReplacements = [
      { from: /:\s*any\[\]/g, to: ': unknown[]' },
      { from: /:\s*any\s*=/g, to: ': unknown =' },
      { from: /:\s*any\s*\)/g, to: ': unknown)' },
      { from: /:\s*any\s*,/g, to: ': unknown,' },
      { from: /:\s*any\s*;/g, to: ': unknown;' }
    ];

    safeAnyReplacements.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
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
  
} catch (error) {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}