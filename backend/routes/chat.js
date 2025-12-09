const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { generateLLMResponse } = require('../services/llmService');

const RETURN_POLICY = `Return Policy:
• Returns allowed within 14 days from delivery
• Product must be unused and in original packaging
• Refunds take 5–7 business days after inspection
• Contact support@shopease.com for return authorization`;

const SHIPPING_INFO = `Shipping Information:
• Standard shipping: 3-5 business days
• Express shipping: 1-2 business days (additional fee)
• Free shipping on orders over Rs. 10,000
• Tracking information sent via email`;

async function loadOrders() {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/orders.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

async function loadProducts() {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

async function loadFaqs() {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/faq.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading FAQs:', error);
    return [];
  }
}

function extractOrderId(message) {
  const orderIdPattern = /ORD\d+/i;
  const match = message.match(orderIdPattern);
  return match ? match[0].toUpperCase() : null;
}

function detectIntent(message) {
  const lower = message.toLowerCase();

  if (/ord\d+/i.test(message) || lower.includes('order status') || lower.includes('where is my order') || lower.includes('track')) {
    return 'order';
  }
  if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange')) {
    return 'return';
  }
  if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('best') || lower.includes('product')) {
    return 'recommendation';
  }
  if (lower.includes('faq') || lower.includes('delivery') || lower.includes('shipping') || lower.includes('payment') || lower.includes('cash on delivery')) {
    return 'faq';
  }
  return 'general';
}

async function checkOrderStatus(message, orders) {
  const orderId = extractOrderId(message);
  if (!orderId) {
    return null;
  }

  const order = orders.find(o => o.orderId.toUpperCase() === orderId);

  if (order) {
    return `Order ${order.orderId}:
Status: ${order.status}
Expected Delivery: ${order.expectedDelivery}
Items: ${order.items.join(', ')}`;
  }

  return `I couldn't find order ${orderId}. Please confirm your order ID (e.g., ORD12345) or double-check your email confirmation.`;
}

function getRecommendations(message, products) {
  const lowerMessage = message.toLowerCase();
  const keywords = lowerMessage.split(/\s+/).filter(word => word.length > 3);
  let recommendations = [];

  for (const product of products) {
    let score = 0;
    const productCategory = product.category.toLowerCase();
    const productTags = product.tags.map(t => t.toLowerCase());

    if (keywords.some(kw => productCategory.includes(kw))) {
      score += 5;
    }

    keywords.forEach(kw => {
      if (productTags.some(tag => tag.includes(kw))) {
        score += 3;
      }
    });

    if (score > 0) {
      recommendations.push({ product, score });
    }
  }

  recommendations.sort((a, b) => b.score - a.score);
  const topRecommendations = recommendations.slice(0, 3).map(r => r.product);

  if (topRecommendations.length > 0) {
    let response = "Here are some product recommendations:\n\n";
    topRecommendations.forEach((product, index) => {
      response += `${index + 1}. ${product.name}\n`;
      response += `   Category: ${product.category}\n`;
      response += `   Price: Rs. ${product.price.toLocaleString()}\n`;
      response += `   Tags: ${product.tags.join(', ')}\n\n`;
    });
    return response;
  }

  if (products.length > 0) {
    let response = "Here are our featured products:\n\n";
    products.slice(0, 3).forEach((product, index) => {
      response += `${index + 1}. ${product.name} - Rs. ${product.price.toLocaleString()}\n`;
    });
    return response;
  }

  return null;
}

function getFaqResponse(message, faqs) {
  const lower = message.toLowerCase();
  const match = faqs.find(faq =>
    faq.keywords.some(keyword => lower.includes(keyword.toLowerCase())) ||
    lower.includes(faq.question.toLowerCase())
  );
  return match ? `${match.question}\n${match.answer}` : null;
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: 'Please provide a message.' });
    }

    const userMessage = message.trim();
    const intent = detectIntent(userMessage);

    const [orders, products, faqs] = await Promise.all([
      loadOrders(),
      loadProducts(),
      loadFaqs()
    ]);

    let reply = '';

    if (intent === 'order') {
      reply = await checkOrderStatus(userMessage, orders);
      if (!reply) {
        reply = 'I can help track your order. Please share your order ID (e.g., ORD12345).';
      }
    } else if (intent === 'return') {
      reply = RETURN_POLICY;
    } else if (intent === 'recommendation') {
      reply = getRecommendations(userMessage, products);
    }

    if (!reply) {
      const faqAnswer = getFaqResponse(userMessage, faqs);
      if (faqAnswer) {
        reply = faqAnswer;
      }
    }

    if (!reply && (userMessage.toLowerCase().includes('shipping') || userMessage.toLowerCase().includes('delivery'))) {
      reply = SHIPPING_INFO;
    }

    if (!reply) {
      reply = await generateLLMResponse(userMessage, { orders, products, faqs });
    }

    res.json({ reply, intent });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ reply: 'I apologize, but I encountered an error. Please try again.' });
  }
});

module.exports = router;

