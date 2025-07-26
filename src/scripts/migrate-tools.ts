#!/usr/bin/env node
/**
 * Migration Script for Assessment Tools
 * Run with: npx tsx src/scripts/migrate-tools.ts
 */

import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import { ToolMigrationUtility, type DynamicTool } from '@/lib/tool-migration-utility'

// Mock tool configurations for migration
const MOCK_TOOL_CONFIGS = {
  'goal-achievement-predictor': {
    id: 'goal-achievement-predictor',
    title: 'Goal Achievement Predictor',
    description: 'Discover your probability of achieving your goals with our scientifically-backed assessment.',
    estimatedTime: 10,
    leadCaptureLevel: 2,
    questions: [
      {
        id: 'q1',
        type: 'scale',
        text: 'How clearly defined is your goal?',
        weight: 1.5,
        category: 'specificity',
        min: 1,
        max: 10
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        text: 'What is your primary motivation for this goal?',
        weight: 1.3,
        category: 'motivation',
        options: [
          { value: 'intrinsic', label: 'Personal fulfillment' },
          { value: 'extrinsic', label: 'External rewards' },
          { value: 'mixed', label: 'Both internal and external' }
        ]
      },
      {
        id: 'q3',
        type: 'text',
        text: 'Describe your action plan in detail',
        weight: 1.7,
        category: 'planning',
        minLength: 50,
        maxLength: 500
      }
    ],
    categories: [
      { name: 'Specificity', weight: 1.5 },
      { name: 'Motivation', weight: 1.3 },
      { name: 'Planning', weight: 1.7 },
      { name: 'Environment', weight: 1.0 },
      { name: 'Skills', weight: 1.2 },
      { name: 'Resources', weight: 1.0 }
    ],
    thresholds: [
      {
        min: 0,
        max: 40,
        label: 'Low Probability',
        description: 'Your goal needs more refinement',
        recommendations: ['Clarify your goal', 'Build a detailed action plan']
      },
      {
        min: 41,
        max: 70,
        label: 'Moderate Probability',
        description: 'You have a good foundation',
        recommendations: ['Strengthen weak areas', 'Seek accountability']
      },
      {
        min: 71,
        max: 100,
        label: 'High Probability',
        description: "You're well-positioned for success",
        recommendations: ['Execute your plan', 'Track progress regularly']
      }
    ]
  },
  'leadership-style-profiler': {
    id: 'leadership-style-profiler',
    title: 'Leadership Style Profiler',
    description: 'Uncover your unique leadership style and learn how to leverage it for maximum impact.',
    estimatedTime: 15,
    leadCaptureLevel: 1,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'When making important decisions, you tend to:',
        weight: 1.5,
        category: 'decision-making',
        options: [
          { value: 'data', label: 'Analyze all available data' },
          { value: 'intuition', label: 'Trust your gut feeling' },
          { value: 'consensus', label: 'Seek team consensus' },
          { value: 'expert', label: 'Consult with experts' }
        ]
      },
      {
        id: 'q2',
        type: 'scale',
        text: 'How comfortable are you with delegating important tasks?',
        weight: 1.0,
        category: 'delegation',
        min: 1,
        max: 10
      }
    ],
    resultTiers: [
      {
        name: 'Visionary Leader',
        minScore: 80,
        description: 'You inspire through bold vision',
        suggestions: ['Share your vision more often', 'Build strong execution teams']
      },
      {
        name: 'Collaborative Leader',
        minScore: 60,
        description: 'You build consensus and teamwork',
        suggestions: ['Practice decisive action', 'Balance collaboration with efficiency']
      },
      {
        name: 'Analytical Leader',
        minScore: 40,
        description: 'You lead through data and logic',
        suggestions: ['Connect more emotionally', 'Trust intuition occasionally']
      },
      {
        name: 'Supportive Leader',
        minScore: 0,
        description: 'You empower others to succeed',
        suggestions: ['Assert your vision', 'Take more calculated risks']
      }
    ]
  }
}

async function migrateTools() {
  console.log('🚀 Starting tool migration...')
  
  try {
    // Find all tool files
    const toolPaths = await glob('src/components/tools/**/*.tsx', {
      ignore: ['**/index.tsx', '**/*.test.tsx']
    })
    
    console.log(`Found ${toolPaths.length} tool files`)
    
    // For demo, we'll migrate just the mock configs
    const toolsToMigrate = Object.entries(MOCK_TOOL_CONFIGS).map(([key, config]) => {
      const mockPath = `src/components/tools/${key}.tsx`
      return { path: mockPath, config }
    })
    
    // Migrate tools
    const migratedTools: DynamicTool[] = []
    const migrationResults = []
    
    for (const { path: toolPath, config } of toolsToMigrate) {
      console.log(`\nMigrating: ${toolPath}`)
      
      try {
        const migrated = ToolMigrationUtility.migrateTool(toolPath, config)
        const validation = ToolMigrationUtility.validateTool(migrated)
        
        if (validation.valid) {
          migratedTools.push(migrated)
          console.log(`✅ Successfully migrated: ${migrated.title}`)
        } else {
          console.log(`❌ Validation failed: ${validation.errors?.join(', ')}`)
        }
        
        migrationResults.push({
          path: toolPath,
          original: config,
          migrated,
          valid: validation.valid,
          errors: validation.errors
        })
      } catch (error) {
        console.error(`❌ Error migrating ${toolPath}:`, error)
      }
    }
    
    // Generate report
    const report = ToolMigrationUtility.generateMigrationReport(migrationResults)
    
    console.log('\n📊 Migration Report:')
    console.log('====================\n')
    console.log(`Total tools: ${report.summary.total}`)
    console.log(`Successful: ${report.summary.successful}`)
    console.log(`Failed: ${report.summary.failed}`)
    
    console.log('\nBy Category:')
    Object.entries(report.byCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`)
    })
    
    console.log('\nBy Question Type:')
    Object.entries(report.byQuestionType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })
    
    if (report.failures.length > 0) {
      console.log('\n❌ Failures:')
      report.failures.forEach(failure => {
        console.log(`  ${failure.path}:`)
        failure.errors.forEach(error => console.log(`    - ${error}`))
      })
    }
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'migrated-tools')
    await fs.mkdir(outputDir, { recursive: true })
    
    // Export migrated tools
    for (const tool of migratedTools) {
      // Export as JSON
      const jsonPath = path.join(outputDir, `${tool.id}.json`)
      await fs.writeFile(jsonPath, ToolMigrationUtility.exportToolAsJSON(tool))
      
      // Export as TypeScript
      const tsPath = path.join(outputDir, `${tool.id}.ts`)
      await fs.writeFile(tsPath, ToolMigrationUtility.exportToolAsTypeScript(tool))
    }
    
    // Save migration report
    const reportPath = path.join(outputDir, 'migration-report.json')
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
    
    console.log(`\n✅ Migration complete! Output saved to: ${outputDir}`)
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateTools()
}