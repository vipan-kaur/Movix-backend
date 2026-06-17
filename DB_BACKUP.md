DB Backup and Restore (Windows)

Overview
- This document shows how to export (backup) a MongoDB database and restore it to your local MongoDB (`mongodb://127.0.0.1:27017`).

Prerequisites
- Install MongoDB Database Tools (mongodump, mongorestore, mongoexport, mongoimport).
- Ensure `mongodump` and `mongorestore` are in your PATH.

1) Backup using mongodump (binary dump)
- Replace <REMOTE_URI> with the source MongoDB connection string (e.g. mongodb://user:pass@host:27017/dbname).

Example command:

mongodump --uri="<REMOTE_URI>" --out="%CD%\\backups\\dump-YYYYMMDD"

This creates a folder `backups/dump-YYYYMMDD` containing BSON files for all collections.

2) Restore to local MongoDB (mongorestore)
- Replace <LOCAL_URI> if your local MongoDB is not the default.

Example command:

mongorestore --uri="mongodb://127.0.0.1:27017" --drop "%CD%\\backups\\dump-YYYYMMDD\\"

`--drop` will drop existing collections in the target before restoring.

3) Alternative: JSON export/import (per-collection)
- Use `mongoexport` to export collections to JSON and `mongoimport` to import them locally.

Export example:

mongoexport --uri="<REMOTE_URI>" --collection=users --out="%CD%\\backups\\users.json" --jsonArray

Import example:

mongoimport --uri="mongodb://127.0.0.1:27017/dbname" --collection=users --file="%CD%\\backups\\users.json" --jsonArray --drop

Notes
- If authentication or SSL is required for the remote DB, include the appropriate options in the URI.
- If your code (movix_backend/index.js) already points to `mongodb://127.0.0.1:27017/Login`, restoring into that database name will make the backend use the restored data.

Security
- Do not commit backups containing credentials to source control.

If you want, I can create a sample `.bat` that prompts for the remote URI and runs `mongodump`/`mongorestore` for you.

4) Option: pull users via the remote backend API (no DB credentials required)
- If the remote backend exposes the `/signup/all` endpoint, you can fetch user documents and insert them into your local MongoDB using the included Node script.
- Script: `scripts/fetch_and_restore.js` — it GETs `<REMOTE_BASE>/signup/all` and upserts into local `Login` DB.

Usage example:

```bash
cd movix_backend
# install dependencies if needed
npm install axios mongoose
node scripts/fetch_and_restore.js https://movix.cradle.services mongodb://127.0.0.1:27017/Login
```

This is useful when you don't have direct MongoDB access but the remote API exposes an endpoint returning all documents.
