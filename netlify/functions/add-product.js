const fs = require('fs');
const path = require('path');
const { parse } = require('lambda-multipart-parser');

exports.handler = async (event) => {
  try {
    const dbPath = path.join(__dirname, '..', '..', 'db.json');
    let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Parse the multipart form data
    const formData = await parse(event);

    const name = formData.name;
    const description = formData.description;
    const price = formData.price || null; // Optional price
    const imageFile = formData.files[0]; // Get the uploaded file

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(imageFile.contentType)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Only JPEG and PNG images are allowed' }),
      };
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.content.length > maxSize) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'File size must be less than 5MB' }),
      };
    }

    // Save the uploaded file to the images folder
    const fileName = `${Date.now()}-${imageFile.filename}`; // Unique file name
    const filePath = path.join(__dirname, '..', '..', 'public', 'images', fileName);
    fs.writeFileSync(filePath, imageFile.content, 'binary');

    // Add the product to the database
    const newProduct = {
      id: db.products.length + 1,
      name,
      image: fileName, // Store the file name
      description,
      price,
      likes: 0,
    };
    db.products.push(newProduct);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error in add-product function:', error); // Debugging line
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};