import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(__dirname, 'backups');
const RETENTION_DAYS = 30;

const files = fs.readdirSync(BACKUP_DIR);

const now = new Date();

files.forEach(file => {
  const filePath = path.join(BACKUP_DIR, file);
  const stats = fs.statSync(filePath);
  const diffDays = (now.getTime() - stats.mtime.getTime()) / (1000 * 3600 * 24);

  if (diffDays > RETENTION_DAYS) {
    fs.unlinkSync(filePath);
    console.log(`Deleted old backup: ${file}`);
  }
});