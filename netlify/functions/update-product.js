const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    const dbPath = path.join(__dirname, '..', '..', 'db.json');
    let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const { productId, name, image, description } = JSON.parse(event.body);

    // Update the product
    const product = db.products.find(p => p.id === productId);
    if (product) {
      product.name = name;
      product.image = image;
      product.description = description;
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }

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