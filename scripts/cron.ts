import cron from 'node-cron';
import { exec }  from 'child_process';

// Run backup every day at 1:00 AM
cron.schedule('0 1 * * *', () => {
  exec('ts-node backup.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});

// Run backup retention management every week on Sunday at 2:00 AM
cron.schedule('0 2 * * 0', () => {
  exec('ts-node manage-backups.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});