const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { password } = JSON.parse(event.body);

  // Check admin password
  if (password !== 'admin123') {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Read the database
  const dbPath = path.join(__dirname, '..', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Return the list of users
  return {
    statusCode: 200,
    body: JSON.stringify(db.users),
  };
};