const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    const dbPath = path.join(__dirname, '..', '..', 'db.json');
    let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const { productId } = JSON.parse(event.body);

    // Remove the product
    db.products = db.products.filter(product => product.id !== productId);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};