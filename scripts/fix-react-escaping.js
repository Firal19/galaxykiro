#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing React escaping issues...');

// Files with React escaping issues
const filesToFix = [
  'src/app/auth/capture/page.tsx',
  'src/app/auth/signin/page.tsx',
  'src/app/change-paradox/learn-more/page.tsx',
  'src/app/change-paradox/page.tsx',
  'src/app/decision-door/page.tsx',
  'src/app/leadership-lever/page.tsx',
  'src/app/membership/register/page.tsx',
  'src/app/mobile-demo/page.tsx',
  'src/app/success-gap/learn-more/page.tsx',
  'src/app/success-gap/page.tsx',
  'src/app/vision-void/page.tsx',
  'src/app/webinars/page.tsx',
  'src/components/assessment/result-visualization.tsx',
  'src/components/branded-resource-template.tsx',
  'src/components/galaxy-dream-team-footer.tsx',
  'src/components/lead-scoring-integration-example.tsx',
  'src/components/office-visit-booking.tsx',
  'src/components/personalization-demo.tsx',
  'src/components/potential-assessment.tsx',
  'src/components/soft-member-benefits.tsx',
  'src/components/tools/goal/goal-achievement-predictor.tsx',
  'src/components/tools/habit/habit-installer.tsx',
  'src/components/tools/habit/routine-optimizer.tsx',
  'src/components/tools/leadership/influence-quotient-calculator.tsx',
  'src/components/tools/mind/mental-model-mapper.tsx',
  'src/components/trust-building/trust-building-dashboard.tsx',
  'src/components/trust-ladder-progression.tsx',
  'src/lib/__tests__/integration/branding-validation.test.tsx'
];

function fixReactEscaping(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix apostrophes in JSX text content
  const apostropheReplacements = [
    // Common contractions
    [/\bdon't\b/g, "don&apos;t"],
    [/\bcan't\b/g, "can&apos;t"],
    [/\bwon't\b/g, "won&apos;t"],
    [/\bisn't\b/g, "isn&apos;t"],
    [/\baren't\b/g, "aren&apos;t"],
    [/\bwasn't\b/g, "wasn&apos;t"],
    [/\bweren't\b/g, "weren&apos;t"],
    [/\bhasn't\b/g, "hasn&apos;t"],
    [/\bhaven't\b/g, "haven&apos;t"],
    [/\bhadn't\b/g, "hadn&apos;t"],
    [/\bwouldn't\b/g, "wouldn&apos;t"],
    [/\bshouldn't\b/g, "shouldn&apos;t"],
    [/\bcouldn't\b/g, "couldn&apos;t"],
    [/\bmustn't\b/g, "mustn&apos;t"],
    [/\bneedn't\b/g, "needn&apos;t"],
    [/\bdaren't\b/g, "daren&apos;t"],
    [/\bmayn't\b/g, "mayn&apos;t"],
    [/\bmightn't\b/g, "mightn&apos;t"],
    [/\boughtn't\b/g, "oughtn&apos;t"],
    [/\bshan't\b/g, "shan&apos;t"],
    [/\bwill not\b/g, "will not"], // Keep this as is
    [/\bI'm\b/g, "I&apos;m"],
    [/\byou're\b/g, "you&apos;re"],
    [/\bhe's\b/g, "he&apos;s"],
    [/\bshe's\b/g, "she&apos;s"],
    [/\bit's\b/g, "it&apos;s"],
    [/\bwe're\b/g, "we&apos;re"],
    [/\bthey're\b/g, "they&apos;re"],
    [/\bI've\b/g, "I&apos;ve"],
    [/\byou've\b/g, "you&apos;ve"],
    [/\bwe've\b/g, "we&apos;ve"],
    [/\bthey've\b/g, "they&apos;ve"],
    [/\bI'd\b/g, "I&apos;d"],
    [/\byou'd\b/g, "you&apos;d"],
    [/\bhe'd\b/g, "he&apos;d"],
    [/\bshe'd\b/g, "she&apos;d"],
    [/\bwe'd\b/g, "we&apos;d"],
    [/\bthey'd\b/g, "they&apos;d"],
    [/\bI'll\b/g, "I&apos;ll"],
    [/\byou'll\b/g, "you&apos;ll"],
    [/\bhe'll\b/g, "he&apos;ll"],
    [/\bshe'll\b/g, "she&apos;ll"],
    [/\bwe'll\b/g, "we&apos;ll"],
    [/\bthey'll\b/g, "they&apos;ll"],
    [/\bthat's\b/g, "that&apos;s"],
    [/\bwhat's\b/g, "what&apos;s"],
    [/\bwhere's\b/g, "where&apos;s"],
    [/\bwhen's\b/g, "when&apos;s"],
    [/\bwho's\b/g, "who&apos;s"],
    [/\bhow's\b/g, "how&apos;s"],
    [/\bwhy's\b/g, "why&apos;s"],
    [/\bthere's\b/g, "there&apos;s"],
    [/\bhere's\b/g, "here&apos;s"],
    [/\blet's\b/g, "let&apos;s"],
    // Possessives
    [/\b(\w+)'s\b/g, "$1&apos;s"],
    [/\b(\w+)s'\b/g, "$1s&apos;"],
    // Other apostrophes
    [/'/g, "&apos;"]
  ];

  // Fix quotes in JSX text content
  const quoteReplacements = [
    [/"/g, "&quot;"],
    [/"/g, "&ldquo;"],
    [/"/g, "&rdquo;"]
  ];

  // Apply apostrophe fixes
  apostropheReplacements.forEach(([pattern, replacement]) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  // Apply quote fixes
  quoteReplacements.forEach(([pattern, replacement]) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed React escaping: ${filePath}`);
  }
}

// Fix all files
filesToFix.forEach(fixReactEscaping);

console.log('\n✨ React escaping fixes completed!');

// Now run a more targeted ESLint fix
console.log('\n🔧 Running ESLint auto-fix for specific rules...');
try {
  execSync('npx eslint src/ --fix --rule "react/no-unescaped-entities: error"', { 
    stdio: 'inherit', 
    cwd: process.cwd() 
  });
  console.log('✅ ESLint auto-fix completed');
} catch (error) {
  console.log('⚠️  ESLint completed with some remaining issues');
}

console.log('\n🎉 All React escaping fixes completed!');