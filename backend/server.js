const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat');
const ordersRoutes = require('./routes/orders');
const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

