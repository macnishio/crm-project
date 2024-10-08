import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(__dirname, 'backups');

if (!fs.existsSync(BACKUP_DIR)){
  fs.mkdirSync(BACKUP_DIR);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `backup-${timestamp}.sql`;
const filepath = path.join(BACKUP_DIR, filename);

const command = `PGPASSWORD=${process.env.DB_PASSWORD} pg_dump -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} > ${filepath}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Backup created successfully: ${filepath}`);
});