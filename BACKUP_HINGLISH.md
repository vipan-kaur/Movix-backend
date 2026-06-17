DB Backup — Hinglish quick-guide

1) Purpose
- Yeh file do cheezen batati hai: (A) agar remote backend `/signup/all` expose karta hai toh ek Node script se backup kaise lena, (B) agar direct DB access ho toh `mongodump`/`mongorestore` se full backup/restore kaise karein.

2) Script method (no DB credentials needed if API public)
- Script location: `scripts/backup_via_api.js`
- Install deps (backend folder):
  - `npm install axios`
- Run:
  - `cd movix_backend`
  - `node scripts/backup_via_api.js https://movix.cradle.services` (default output `movix_backend/backups/users-backup-<timestamp>.json`)
- Kya milega: ek JSON file jisme `/signup/all` se aaye huye sab user documents honge. Easy and safe jab DB credentials na ho.

3) Direct DB dump/restore (recommended if you have DB access)
- Requirements: MongoDB Database Tools installed (mongodump, mongorestore) and local `mongod` running.
- Dump remote DB (binary folder):
  - `mongodump --uri="mongodb://USER:PASS@remote-host:27017/DBNAME" --out="C:\path\to\dump-folder"`
- Or compressed archive:
  - `mongodump --uri="mongodb://USER:PASS@remote-host:27017/DBNAME" --archive=C:\path\to\backup.gz --gzip`
- Transfer `dump-folder` or `backup.gz` to your machine (SCP / download).
- Restore to local:
  - From folder: `mongorestore --uri="mongodb://127.0.0.1:27017" --drop "C:\path\to\dump-folder"`
  - From archive: `mongorestore --uri="mongodb://127.0.0.1:27017" --archive=C:\path\to\backup.gz --gzip --drop`

4) Per-collection JSON export/import (alternative)
- Export a single collection on source:
  - `mongoexport --uri="mongodb://USER:PASS@host:27017/DBNAME" --collection=users --out=users.json --jsonArray`
- Import locally:
  - `mongoimport --uri="mongodb://127.0.0.1:27017/DBNAME" --collection=users --file=users.json --jsonArray --drop`

5) Restore via API-output
- Agar tumne `backup_via_api.js` se JSON liya hai, use `mongoimport` se local DB mein daal sakte ho:
  - `mongoimport --uri="mongodb://127.0.0.1:27017/Login" --collection=register --file=backups/users-backup-YYYY-MM-DDTHH-mm-ss-...json --jsonArray --drop`
  - Note: frontend/backend models may expect collection name `register` (see `models/Register.js`). Adjust `--collection` accordingly.

6) Important tips
- Never commit backup files with credentials to git.
- If remote uses `mongodb+srv://` or auth DB, include those in `--uri` and possibly `--ssl` options.
- Ensure local `mongod` is running before `mongorestore` or `mongoimport`.
- If backend expects DB name `Login`, restore into that DB or update `index.js` connection string.

7) Quick checklist (what I can do for you)
- Run `node scripts/backup_via_api.js` here and attach the JSON (if endpoint public).
- Or, if you provide remote DB URI and allow, I can give exact `mongodump` command and help restore.
