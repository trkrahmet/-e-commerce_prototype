const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// Add no-cache headers to prevent browser caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Updated products with Turkish names
const products = [
  { id: 1, name: 'Dizüstü Bilgisayar', price: 1000, category: 'Teknoloji' },
  { id: 2, name: 'Akıllı Telefon', price: 500, category: 'Teknoloji' },
  { id: 3, name: 'Kulaklık', price: 100, category: 'Teknoloji' },
  { id: 4, name: 'Tablet', price: 300, category: 'Teknoloji' },
  { id: 5, name: 'Akıllı Saat', price: 200, category: 'Teknoloji' },
  { id: 6, name: 'Tabak', price: 20, category: 'Ev' },
  { id: 7, name: 'Çatal', price: 5, category: 'Ev' },
  { id: 8, name: 'Bıçak', price: 5, category: 'Ev' },
  { id: 9, name: 'Kaşık', price: 5, category: 'Ev' },
  { id: 10, name: 'Bardak', price: 10, category: 'Ev' },
  { id: 11, name: 'Gömlek', price: 25, category: 'Giyim' },
  { id: 12, name: 'Kot Pantolon', price: 50, category: 'Giyim' },
  { id: 13, name: 'Ceket', price: 100, category: 'Giyim' },
  { id: 14, name: 'Ayakkabı', price: 75, category: 'Giyim' },
  { id: 15, name: 'Şapka', price: 15, category: 'Giyim' },
  { id: 16, name: 'Blender', price: 60, category: 'Ev Aletleri' },
  { id: 17, name: 'Mikrodalga', price: 120, category: 'Ev Aletleri' },
  { id: 18, name: 'Buzdolabı', price: 800, category: 'Ev Aletleri' },
  { id: 19, name: 'Fırın', price: 500, category: 'Ev Aletleri' },
  { id: 20, name: 'Tost Makinesi', price: 30, category: 'Ev Aletleri' }
];

// Cart
let cart = [];

// Routes

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Add product to cart
app.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingCartItem = cart.find(item => item.id === productId);
  if (existingCartItem) {
    existingCartItem.quantity = quantity; // Set the quantity directly
    if (existingCartItem.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId); // Remove item if quantity is 0 or less
    }
  } else if (quantity > 0) {
    const cartItem = { ...product, quantity };
    cart.push(cartItem);
  }

  res.status(201).json({ message: 'Cart updated successfully' });
});

// View cart
app.get('/cart', (req, res) => {
  res.json(cart);
});

// Remove item from cart
app.delete('/cart/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  cart.splice(itemIndex, 1);
  res.status(200).json({ message: 'Item removed from cart' });
});

// Serve the cart.html file for the /cart.html route
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart.html'));
});

// Get products by category
app.get('/products/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const filteredProducts = products.filter(product =>
    product.category.toLowerCase() === category
  );

  if (filteredProducts.length === 0) {
    return res.status(404).json({ message: 'Kategori bulunamadı' });
  }

  res.json(filteredProducts);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});