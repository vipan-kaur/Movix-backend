// backup_via_api.js
// Fetches all users from remote backend (/signup/all) and saves to a timestamped JSON file.
// Usage: node scripts/backup_via_api.js <REMOTE_BASE_URL> [OUT_DIR]

const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function main() {
  const remoteBase = process.argv[2] || 'https://movix.cradle.services';
  const outDir = process.argv[3] || path.join(process.cwd(), 'backups');

  const endpoint = `${remoteBase.replace(/\/$/, '')}/signup/all`;
  console.log('Fetching from', endpoint);

  try {
    const res = await axios.get(endpoint, { timeout: 20000 });
    if (!Array.isArray(res.data)) {
      console.error('Unexpected response format - expected an array. Response:', typeof res.data);
      process.exit(1);
    }

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const outFile = path.join(outDir, `users-backup-${ts}.json`);
    fs.writeFileSync(outFile, JSON.stringify(res.data, null, 2), 'utf8');

    console.log('Backup saved to', outFile);
  } catch (err) {
    console.error('Error fetching or saving backup:', err.message || err);
    process.exit(1);
  }
}

main();
