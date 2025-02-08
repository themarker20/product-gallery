const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    console.log('Fetching users...'); // Debugging line
    const dbPath = path.join(__dirname, '..', '..', 'db.json'); // Correct path
    console.log('Database path:', dbPath); // Debugging line

    // Check if the file exists
    if (!fs.existsSync(dbPath)) {
      throw new Error('db.json file not found');
    }

    // Read and parse the file
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log('Database content:', db); // Debugging line

    const { name, phone } = JSON.parse(event.body);

    // Check if user already exists
    const userExists = db.users.some(user => user.phone === phone);
    if (!userExists) {
      db.users.push({ name, phone, likedProducts: [] });
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, phone }), // Return the phone number
    };
  } catch (error) {
    console.error('Error in login function:', error); // Debugging line
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};