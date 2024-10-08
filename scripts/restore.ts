import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(__dirname, 'backups');

// Get the latest backup file
const files = fs.readdirSync(BACKUP_DIR);
const latestBackup = files.sort().reverse()[0];

if (!latestBackup) {
  console.error('No backup files found');
  process.exit(1);
}

const filepath = path.join(BACKUP_DIR, latestBackup);

const command = `PGPASSWORD=${process.env.DB_PASSWORD} psql -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} < ${filepath}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Database restored successfully from: ${filepath}`);
});