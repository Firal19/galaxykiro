/**
 * Supabase Automated Backup Configuration Script
 * 
 * This script configures automated backups and point-in-time recovery for the Supabase project.
 * It should be run once during initial setup or when changing backup configurations.
 * 
 * Requirements:
 * - Supabase CLI installed: npm install -g supabase
 * - Authenticated with Supabase: supabase login
 * - Project reference ID available
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const BACKUP_SCHEDULE = process.env.BACKUP_SCHEDULE || '0 0 * * *'; // Default: daily at midnight
const BACKUP_RETENTION_DAYS = process.env.BACKUP_RETENTION_DAYS || 30;
const PITR_ENABLED = process.env.PITR_ENABLED === 'true';
const PITR_RETENTION_DAYS = process.env.PITR_RETENTION_DAYS || 7;

// Validate required environment variables
if (!SUPABASE_PROJECT_ID) {
  console.error('Error: SUPABASE_PROJECT_ID environment variable is required');
  process.exit(1);
}

// Create backup configuration file
const backupConfig = {
  schedule: BACKUP_SCHEDULE,
  retention_days: parseInt(BACKUP_RETENTION_DAYS, 10),
  pitr: {
    enabled: PITR_ENABLED,
    retention_days: parseInt(PITR_RETENTION_DAYS, 10),
  },
};

// Save configuration to file
const configDir = path.join(__dirname, '../.supabase');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

const configPath = path.join(configDir, 'backup-config.json');
fs.writeFileSync(configPath, JSON.stringify(backupConfig, null, 2));
console.log(`Backup configuration saved to ${configPath}`);

// Configure backups using Supabase CLI
try {
  // Configure automated backups
  console.log('Configuring automated backups...');
  execSync(`supabase db backups configure --project-ref ${SUPABASE_PROJECT_ID} --cron-schedule "${BACKUP_SCHEDULE}" --retention-days ${BACKUP_RETENTION_DAYS}`, { stdio: 'inherit' });
  
  // Configure point-in-time recovery if enabled
  if (PITR_ENABLED) {
    console.log('Enabling point-in-time recovery...');
    execSync(`supabase db pitr enable --project-ref ${SUPABASE_PROJECT_ID} --retention-days ${PITR_RETENTION_DAYS}`, { stdio: 'inherit' });
  }
  
  console.log('Backup configuration completed successfully!');
  console.log(`- Automated backups scheduled: ${BACKUP_SCHEDULE}`);
  console.log(`- Backup retention period: ${BACKUP_RETENTION_DAYS} days`);
  console.log(`- Point-in-time recovery: ${PITR_ENABLED ? 'Enabled' : 'Disabled'}`);
  if (PITR_ENABLED) {
    console.log(`- PITR retention period: ${PITR_RETENTION_DAYS} days`);
  }
  
  // Create documentation for backup and restore procedures
  const docsContent = `# Supabase Backup and Recovery Procedures

## Automated Backup Configuration

The project is configured with the following backup settings:

- **Backup Schedule**: ${BACKUP_SCHEDULE} (cron format)
- **Backup Retention Period**: ${BACKUP_RETENTION_DAYS} days
- **Point-in-Time Recovery**: ${PITR_ENABLED ? 'Enabled' : 'Disabled'}
${PITR_ENABLED ? `- **PITR Retention Period**: ${PITR_RETENTION_DAYS} days` : ''}

## Backup Types

1. **Scheduled Backups**: Full database backups taken according to the configured schedule
2. **Manual Backups**: On-demand backups that can be triggered through the Supabase dashboard or CLI
${PITR_ENABLED ? '3. **Point-in-Time Recovery**: Continuous backup allowing restoration to any point within the retention period' : ''}

## Performing a Manual Backup

To create a manual backup:

\`\`\`bash
supabase db backups create --project-ref ${SUPABASE_PROJECT_ID}
\`\`\`

## Listing Available Backups

To list all available backups:

\`\`\`bash
supabase db backups list --project-ref ${SUPABASE_PROJECT_ID}
\`\`\`

## Restoring from a Backup

### Restore from a Scheduled or Manual Backup

1. Identify the backup ID from the list of backups
2. Run the restore command:

\`\`\`bash
supabase db backups restore <backup-id> --project-ref ${SUPABASE_PROJECT_ID}
\`\`\`

${PITR_ENABLED ? `### Point-in-Time Recovery

To restore to a specific point in time:

\`\`\`bash
supabase db pitr restore --project-ref ${SUPABASE_PROJECT_ID} --timestamp "YYYY-MM-DD HH:MM:SS"
\`\`\`

The timestamp must be within the PITR retention period (${PITR_RETENTION_DAYS} days).` : ''}

## Monitoring Backup Status

To check the status of backups:

\`\`\`bash
supabase db backups status --project-ref ${SUPABASE_PROJECT_ID}
\`\`\`

## Emergency Contact Information

In case of database issues requiring immediate attention:

1. Primary Contact: [Database Administrator Name] - [Email/Phone]
2. Secondary Contact: [Backup Administrator Name] - [Email/Phone]
3. Supabase Support: support@supabase.io
`;

  fs.writeFileSync(path.join(__dirname, '../docs/backup-recovery.md'), docsContent);
  console.log('Backup and recovery documentation created at docs/backup-recovery.md');
  
} catch (error) {
  console.error('Error configuring backups:', error.message);
  process.exit(1);
}