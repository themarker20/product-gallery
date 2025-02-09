// Login functionality
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  const response = await fetch("/netlify/functions/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("phone", data.phone); // Store the phone number
    window.location.href = "gallery.html";
  }
});

// Admin functionality
document.getElementById("adminForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;

  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (response.ok) {
    // Show admin content
    document.getElementById("adminContent").style.display = "block";
    loadProducts(); // Load products after successful login
    loadUsers(); // Load users after successful login
  } else {
    alert("Incorrect password");
  }
});

// Load users
async function loadUsers() {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "admin123" }), // Send the admin password
  });

  if (response.ok) {
    const users = await response.json();
    const usersTable = document
      .getElementById("usersTable")
      .getElementsByTagName("tbody")[0];
    usersTable.innerHTML = "";

    users.forEach((user) => {
      const row = usersTable.insertRow();
      row.insertCell().textContent = user.name;
      row.insertCell().textContent = user.phone;
      row.insertCell().textContent = user.likedProducts.join(", ");
    });
  }
}

// Load products
async function loadProducts() {
  const response = await fetch("/api/products");
  const products = await response.json();

  const productsTable = document
    .getElementById("productsTable")
    .getElementsByTagName("tbody")[0];
  productsTable.innerHTML = "";

  products.forEach((product) => {
    const row = productsTable.insertRow();
    row.insertCell().textContent = product.id;
    row.insertCell().textContent = product.name;
    row.insertCell().innerHTML = `<img src="images/${product.image}" alt="${product.name}" width="50">`;
    row.insertCell().textContent = product.description;
    row.insertCell().textContent = product.price || "N/A"; // Display price or 'N/A' if null
    row.insertCell().textContent = product.likes;

    // Add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await deleteProduct(product.id);
      loadProducts(); // Reload products after deletion
    });

    // Add edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editProduct(product);
    });

    const actionsCell = row.insertCell();
    actionsCell.appendChild(deleteButton);
    actionsCell.appendChild(editButton);
  });
}

// Delete product
async function deleteProduct(productId) {
  const response = await fetch(`/api/delete-product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  if (response.ok) {
    alert("Product deleted successfully");
  } else {
    alert("Failed to delete product");
  }
}

// Edit product
function editProduct(product) {
  const newName = prompt("Enter new name:", product.name);
  const newImage = prompt("Enter new image URL:", product.image);
  const newDescription = prompt("Enter new description:", product.description);
  const newPrice = prompt("Enter new price:", product.price);

  if (newName && newImage && newDescription) {
    updateProduct(product.id, newName, newImage, newDescription, newPrice);
  }
}

// Update product
async function updateProduct(productId, name, image, description, price) {
  const response = await fetch(`/api/update-product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, name, image, description, price }),
  });

  if (response.ok) {
    alert("Product updated successfully");
    loadProducts(); // Reload products after update
  } else {
    alert("Failed to update product");
  }
}

// Add product
document
  .getElementById("addProductForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const imageFile = document.getElementById("productImage").files[0];
    const description = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value || null; // Optional price

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageFile);
    formData.append("description", description);
    if (price) formData.append("price", price);

    const response = await fetch("/api/add-product", {
      method: "POST",
      body: formData, // Send FormData instead of JSON
    });

    if (response.ok) {
      alert("Product added successfully");
      loadProducts(); // Reload products after addition
    } else {
      alert("Failed to add product");
    }
  });

// Load products on gallery page
if (window.location.pathname.endsWith("gallery.html")) {
  loadGalleryProducts();
}

// Load products for the gallery page
async function loadGalleryProducts() {
  const response = await fetch("/api/products");
  const products = await response.json();

  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
      <img src="images/${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      ${product.price ? `<p>السعر: ${product.price} ريال</p>` : ""}
      <button class="like-btn" data-id="${product.id}">عدد مرات الإعجاب (${
      product.likes
    })</button>
    `;
    productsContainer.appendChild(productDiv);
  });

  // Add like button functionality
  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");
      const phone = localStorage.getItem("phone"); // Ensure the phone number is stored in localStorage

      const response = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: parseInt(productId), phone }),
      });

      if (response.ok) {
        const data = await response.json();
        button.textContent = `Like (${data.likes})`; // Update the like count
      }
    });
  });
}