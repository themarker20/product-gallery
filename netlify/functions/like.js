const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    console.log('Handling like request...'); // Debugging line
    const dbPath = path.join(__dirname, '..', '..', 'db.json'); // Correct path
    console.log('Database path:', dbPath); // Debugging line

    // Check if the file exists
    if (!fs.existsSync(dbPath)) {
      throw new Error('db.json file not found');
    }

    // Read and parse the file
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log('Database content:', db); // Debugging line

    const { productId, phone } = JSON.parse(event.body);
    console.log('Product ID:', productId); // Debugging line
    console.log('Phone:', phone); // Debugging line

    // Find the product and user
    const product = db.products.find(p => p.id === productId);
    const user = db.users.find(u => u.phone === phone);

    if (product && user) {
      // Check if the user has already liked the product
      if (user.likedProducts.includes(product.name)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, message: 'You have already liked this product' }),
        };
      }

      // Update product likes and user's liked products
      product.likes += 1;
      user.likedProducts.push(product.name);
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, likes: product.likes }),
      };
    } else {
      console.error('Product or user not found'); // Debugging line
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Product or user not found' }),
      };
    }
  } catch (error) {
    console.error('Error in like function:', error); // Debugging line
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};