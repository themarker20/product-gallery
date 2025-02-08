const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    console.log('Fetching products...'); // Debugging line
    const dbPath = path.join(__dirname, '..', '..', 'db.json'); // Correct path
    console.log('Database path:', dbPath); // Debugging line

    // Check if the file exists
    if (!fs.existsSync(dbPath)) {
      throw new Error('db.json file not found');
    }

    // Read and parse the file
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log('Database content:', db); // Debugging line

    // Check if products exist in the database
    if (!db.products) {
      throw new Error('Products not found in db.json');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(db.products),
    };
  } catch (error) {
    console.error('Error in products function:', error); // Debugging line
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};