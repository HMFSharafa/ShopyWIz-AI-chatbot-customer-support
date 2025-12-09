const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Load orders from JSON file
async function loadOrders() {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/orders.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

// GET /api/orders/:orderId
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = await loadOrders();
    
    // Normalize order ID (uppercase)
    const normalizedOrderId = orderId.toUpperCase();
    
    const order = orders.find(o => o.orderId.toUpperCase() === normalizedOrderId);
    
    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found',
        message: `Order ${normalizedOrderId} could not be found. Please verify your order ID.`
      });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders (get all orders - for debugging)
router.get('/', async (req, res) => {
  try {
    const orders = await loadOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

