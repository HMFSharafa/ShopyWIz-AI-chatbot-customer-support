const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Load products from JSON file
async function loadProducts() {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await loadProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:category (filter by category)
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await loadProducts();
    
    const filtered = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

