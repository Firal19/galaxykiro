#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting comprehensive lint fix...');

// Files to fix based on lint output
const filesToFix = [
  'src/app/admin/content/page.tsx',
  'src/app/admin/webinars/page.tsx',
  'src/app/api/admin/content/[id]/route.ts',
  'src/app/api/admin/content/route.ts',
  'src/app/api/analytics/performance/route.ts',
  'src/app/api/office-locations/[id]/availability/route.ts',
  'src/app/api/office-locations/route.ts',
  'src/app/api/office-visits/book/route.ts',
  'src/app/api/webinars/register/route.ts',
  'src/app/auth/capture/page.tsx',
  'src/app/auth/register/page.tsx',
  'src/app/auth/signin/page.tsx',
  'src/app/change-paradox/learn-more/page.tsx',
  'src/app/change-paradox/page.tsx',
  'src/app/decision-door/page.tsx',
  'src/app/leadership-lever/page.tsx',
  'src/app/membership/dashboard/page.tsx',
  'src/app/membership/register/page.tsx',
  'src/app/membership/settings/page.tsx',
  'src/app/mobile-demo/page.tsx',
  'src/app/success-gap/learn-more/page.tsx',
  'src/app/success-gap/page.tsx',
  'src/app/vision-void/page.tsx',
  'src/app/webinars/page.tsx',
  'src/components/admin/content-ab-testing-dashboard.tsx',
  'src/components/admin/content-analytics.tsx',
  'src/components/admin/content-form.tsx',
  'src/components/admin/content-publishing-calendar.tsx',
  'src/components/analytics-dashboard.tsx',
  'src/components/assessment/assessment-tool.tsx',
  'src/components/assessment/result-visualization.tsx',
  'src/components/branded-resource-template.tsx',
  'src/components/cta-optimization-dashboard.tsx',
  'src/components/dynamic-cta-demo.tsx',
  'src/components/dynamic-cta.tsx',
  'src/components/enhanced-cta.tsx',
  'src/components/ethiopian-success-stories.tsx',
  'src/components/galaxy-dream-team-footer.tsx',
  'src/components/gdpr-compliance.tsx',
  'src/components/lead-scoring-integration-example.tsx',
  'src/components/navigation.tsx',
  'src/components/office-visit-booking.tsx',
  'src/components/personalization-demo.tsx',
  'src/components/potential-assessment.tsx',
  'src/components/progressive-form.tsx',
  'src/components/soft-member-benefits.tsx',
  'src/components/swipe-section-navigator.tsx',
  'src/components/tools/goal/dream-clarity-generator.tsx',
  'src/components/tools/goal/goal-achievement-predictor.tsx',
  'src/components/tools/goal/life-wheel-diagnostic.tsx',
  'src/components/tools/habit/habit-installer.tsx',
  'src/components/tools/habit/habit-strength-analyzer.tsx',
  'src/components/tools/habit/routine-optimizer.tsx',
  'src/components/tools/leadership/influence-quotient-calculator.tsx',
  'src/components/tools/leadership/leadership-style-profiler.tsx',
  'src/components/tools/leadership/team-builder-simulator.tsx',
  'src/components/tools/mind/affirmation-architect.tsx',
  'src/components/tools/mind/inner-dialogue-decoder.tsx',
  'src/components/tools/mind/mental-model-mapper.tsx',
  'src/components/tools/potential/limiting-belief-identifier.tsx',
  'src/components/tools/potential/potential-quotient-calculator.tsx',
  'src/components/tools/potential/transformation-readiness-score.tsx',
  'src/components/trust-building/trust-building-dashboard.tsx',
  'src/components/trust-ladder-progression.tsx',
  'src/components/ui/calendar.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/textarea.tsx',
  'src/components/webinar-listing.tsx',
  'src/components/webinar-registration.tsx',
  'src/lib/__tests__/a11y/accessibility.test.tsx',
  'src/lib/__tests__/integration/basic-integration.test.tsx',
  'src/lib/__tests__/integration/branding-validation.test.tsx',
  'src/lib/__tests__/integration/final-integration.test.tsx',
  'src/lib/__tests__/integration/system-integration.test.tsx',
  'src/lib/__tests__/performance/performance.test.ts',
  'src/lib/__tests__/security/comprehensive-security.test.ts',
  'src/lib/__tests__/security/security-integration.test.ts',
  'src/lib/__tests__/unit/assessment-engine.test.ts',
  'src/lib/ab-testing-framework.ts',
  'src/lib/ab-testing.ts',
  'src/lib/api-client.ts',
  'src/lib/auth.ts',
  'src/lib/behavioral-analysis.ts',
  'src/lib/behavioral-triggers.ts',
  'src/lib/content-review-system.ts',
  'src/lib/content-validation.ts',
  'src/lib/contexts/auth-context.tsx',
  'src/lib/continuous-education.ts',
  'src/lib/email-service.ts',
  'src/lib/engagement-engine.ts',
  'src/lib/hooks/use-dynamic-personalization.ts',
  'src/lib/hooks/use-engagement-tracking.ts',
  'src/lib/hooks/use-lead-scoring.ts',
  'src/lib/hooks/use-pwa.ts',
  'src/lib/hooks/use-real-time-analytics.ts',
  'src/lib/hooks/use-soft-membership.ts',
  'src/lib/hooks/use-swipe-navigation.ts',
  'src/lib/i18n-utils.ts',
  'src/lib/lead-scoring-engine.ts',
  'src/lib/models/content.ts',
  'src/lib/models/user.ts',
  'src/lib/performance-monitoring.ts',
  'src/lib/personalization-engine.ts',
  'src/lib/psychological-triggers.ts',
  'src/lib/realtime-client.ts',
  'src/lib/responsive-utils.ts',
  'src/lib/score-tracking.ts',
  'src/lib/security.ts',
  'src/lib/session-management.ts',
  'src/lib/supabase-cache.ts',
  'src/lib/supabase.ts',
  'src/lib/utils.ts',
  'src/lib/validations.ts'
];

// Function to fix common issues in a file
function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Fix React unescaped entities
  const entityReplacements = [
    [/'/g, '&apos;'],
    [/"/g, '&quot;'],
    [/'/g, '&rsquo;'],
    [/"/g, '&ldquo;'],
    [/"/g, '&rdquo;']
  ];

  // Only apply entity fixes to JSX/TSX files
  if (filePath.endsWith('.tsx')) {
    // Fix quotes in JSX text content (not in attributes)
    content = content.replace(/>([^<]*['"][^<]*)</g, (match, textContent) => {
      let fixed = textContent;
      fixed = fixed.replace(/'/g, '&apos;');
      fixed = fixed.replace(/"/g, '&quot;');
      return `>${fixed}<`;
    });
    modified = true;
  }

  // Fix TypeScript issues
  // Replace 'any' with proper types where possible
  content = content.replace(/: any\b/g, ': unknown');
  content = content.replace(/any\[\]/g, 'unknown[]');
  content = content.replace(/\(.*?: any\)/g, (match) => match.replace('any', 'unknown'));
  
  // Fix prefer-const issues
  content = content.replace(/let (\w+) = /g, (match, varName) => {
    // Check if variable is reassigned later
    const reassignmentRegex = new RegExp(`\\b${varName}\\s*=`, 'g');
    const matches = content.match(reassignmentRegex);
    if (!matches || matches.length === 1) {
      return `const ${varName} = `;
    }
    return match;
  });

  // Remove unused imports and variables (basic cleanup)
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => {
    // Skip lines with unused imports that are clearly not used
    if (line.includes('Warning:') && line.includes('is defined but never used')) {
      return false;
    }
    return true;
  });

  // Fix empty interfaces
  content = content.replace(/interface\s+(\w+)\s*extends\s+([^{]+)\s*{\s*}/g, 'type $1 = $2');

  // Fix parsing errors in JSX (common trailing comma issues)
  if (filePath.endsWith('.tsx')) {
    // Fix trailing commas in JSX props
    content = content.replace(/,(\s*>)/g, '$1');
    content = content.replace(/,(\s*\/>)/g, '$1');
  }

  if (content !== fs.readFileSync(fullPath, 'utf8')) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed: ${filePath}`);
    modified = true;
  }

  return modified;
}

// Function to remove unused imports
function removeUnusedImports(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const importLines = [];
  const codeLines = [];
  let inImportSection = true;

  lines.forEach(line => {
    if (line.trim().startsWith('import ') || line.trim().startsWith('} from ')) {
      importLines.push(line);
    } else if (line.trim() === '' && inImportSection) {
      importLines.push(line);
    } else {
      inImportSection = false;
      codeLines.push(line);
    }
  });

  const codeContent = codeLines.join('\n');
  const usedImports = [];

  importLines.forEach(line => {
    if (line.trim().startsWith('import ')) {
      // Extract imported names
      const match = line.match(/import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))/);
      if (match) {
        let importedNames = [];
        if (match[1]) {
          // Named imports
          importedNames = match[1].split(',').map(name => name.trim().split(' as ')[0]);
        } else if (match[2]) {
          // Namespace import
          importedNames = [match[2]];
        } else if (match[3]) {
          // Default import
          importedNames = [match[3]];
        }

        // Check if any imported name is used in code
        const isUsed = importedNames.some(name => {
          const regex = new RegExp(`\\b${name}\\b`);
          return regex.test(codeContent);
        });

        if (isUsed) {
          usedImports.push(line);
        }
      }
    } else {
      usedImports.push(line);
    }
  });

  const newContent = [...usedImports, ...codeLines].join('\n');
  
  if (newContent !== content) {
    fs.writeFileSync(fullPath, newContent);
    console.log(`🧹 Cleaned imports: ${filePath}`);
  }
}

// Main execution
console.log(`📁 Processing ${filesToFix.length} files...`);

let fixedCount = 0;
filesToFix.forEach(filePath => {
  try {
    const wasFixed = fixFile(filePath);
    removeUnusedImports(filePath);
    if (wasFixed) fixedCount++;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✨ Completed! Fixed ${fixedCount} files.`);

// Run ESLint fix
console.log('\n🔧 Running ESLint auto-fix...');
try {
  execSync('npm run lint -- --fix', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ ESLint auto-fix completed');
} catch (error) {
  console.log('⚠️  ESLint auto-fix completed with some remaining issues');
}

console.log('\n🎉 Comprehensive lint fix completed!');