// Fetch users from remote backend and insert into local MongoDB
// Usage: node scripts/fetch_and_restore.js <REMOTE_BASE_URL> [LOCAL_MONGO_URI]

const axios = require('axios');
const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  email: String,
  password: String,
  securityQuestion: String,
  securityQuestionAnswer: String,
  token: String,
});

const Registered = mongoose.model('register', RegisterSchema);

async function main() {
  const remoteBase = process.argv[2] || 'https://movix.cradle.services';
  const localUri = process.argv[3] || 'mongodb://127.0.0.1:27017/Login';

  const endpoint = `${remoteBase.replace(/\/$/, '')}/signup/all`;
  console.log('Fetching from', endpoint);

  try {
    const res = await axios.get(endpoint, { timeout: 20000 });
    if (!Array.isArray(res.data)) {
      console.error('Unexpected response format, expected array:', res.status, res.data);
      process.exit(1);
    }

    console.log('Found', res.data.length, 'users. Connecting to local DB', localUri);
    await mongoose.connect(localUri, { useNewUrlParser: true, useUnifiedTopology: true });

    for (const u of res.data) {
      if (!u.email) continue;
      const email = (u.email || '').trim().toLowerCase();
      const existing = await Registered.findOne({ email });
      if (existing) {
        // update fields
        existing.password = u.password || existing.password;
        existing.securityQuestion = u.securityQuestion || existing.securityQuestion;
        existing.securityQuestionAnswer = u.securityQuestionAnswer || existing.securityQuestionAnswer;
        existing.token = u.token || existing.token;
        await existing.save();
        console.log('Updated', email);
      } else {
        const doc = new Registered({
          email,
          password: u.password || '',
          securityQuestion: u.securityQuestion || '',
          securityQuestionAnswer: u.securityQuestionAnswer || '',
          token: u.token || '',
        });
        await doc.save();
        console.log('Inserted', email);
      }
    }

    console.log('Done. Closing DB.');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
