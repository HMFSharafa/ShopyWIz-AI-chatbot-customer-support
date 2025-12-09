# ShopyWiz AI Customer Support System

A full-stack e-commerce application with an integrated AI-powered customer support chatbot. Built with React + Vite + TailwindCSS for the frontend and Node.js + Express for the backend.

## 🚀 Features

- **Modern E-commerce Homepage**: Clean, professional landing page with navigation, hero section, and featured products
- **AI-Powered Chatbot**: LLM-integrated customer support assistant
- **Order Status Lookup**: Real-time order tracking using order IDs
- **Product Recommendations**: Intelligent product suggestions based on user queries
- **Return Policy & Shipping Info**: Quick access to policy information
- **Floating Chat Widget**: Slide-up chat panel with smooth animations
- **Responsive Design**: Mobile-friendly UI built with TailwindCSS

## 📁 Project Structure

```
.
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── package.json              # Node.js dependencies
│   ├── routes/
│   │   ├── chat.js              # Chat API endpoint with LLM integration
│   │   ├── orders.js            # Order lookup endpoint
│   │   └── products.js          # Products API endpoint
│   └── data/
│       ├── orders.json          # Synthetic order data
│       └── products.json        # Synthetic product data
│
└── frontend/
    ├── package.json             # Frontend dependencies
    ├── vite.config.js           # Vite configuration
    ├── tailwind.config.js       # TailwindCSS configuration
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css            # TailwindCSS imports
        └── components/
            ├── Navbar.jsx       # Navigation bar
            ├── Hero.jsx         # Hero section with promo banner
            ├── FeaturedProducts.jsx  # Product showcase
            └── chatbot/
                ├── Chatbot.jsx       # Main chatbot component
                ├── ChatIcon.jsx      # Floating chat icon
                ├── ChatWindow.jsx    # Chat window panel
                ├── MessageBubble.jsx # Message display component
                └── ChatInput.jsx     # Message input component
```

## 🛠️ Prerequisites

- **Node.js** 16+ and **npm** (or yarn)
- **Groq API Key** (optional, for enhanced LLM responses) - Get free at https://console.groq.com

## 📦 Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Groq API (Optional but recommended):**
   - Get a free API key from https://console.groq.com
   - Create a `.env` file in the backend directory:
     ```bash
     GROQ_API_KEY=your_api_key_here
     ```
   - Or export it in your terminal:
     ```bash
     # Windows (PowerShell)
     $env:GROQ_API_KEY="your_api_key_here"
     
     # macOS/Linux
     export GROQ_API_KEY="your_api_key_here"
     ```
   
   > **Note**: The chatbot works without the API key, but responses will be more basic. With the API key, you get enhanced LLM-powered responses.

4. **Start the backend server:**
   ```bash
   npm start
   # or
   node server.js
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

## 🎯 Usage

1. **Start the backend server first** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

4. **Click the floating chat icon** (bottom-right) to open the chatbot

5. **Try these example queries:**
   - "What's the status of order ORD12345?"
   - "What's your return policy?"
   - "Can you recommend some headphones?"
   - "How long does shipping take?"
   - "I'm looking for electronics"

## 🔌 API Endpoints

### POST /api/chat
Send a message to the chatbot and receive a response.

**Request:**
```json
{
  "message": "What's the status of order ORD12345?"
}
```

**Response:**
```json
{
  "reply": "Order ORD12345:\nStatus: Shipped\nExpected Delivery: 2025-02-14\nItems: Wireless Headphones"
}
```

### GET /api/orders/:orderId
Get order details by order ID.

**Example:**
```bash
GET http://localhost:5000/api/orders/ORD12345
```

**Response:**
```json
{
  "orderId": "ORD12345",
  "customer": "Ayesha Fernando",
  "items": ["Wireless Headphones"],
  "status": "Shipped",
  "expectedDelivery": "2025-02-14"
}
```

### GET /api/products
Get all products.

**Response:**
```json
[
  {
    "name": "Wireless Headphones",
    "category": "Electronics",
    "price": 8500,
    "tags": ["audio", "bluetooth", "wireless"],
    "description": "Premium wireless headphones with noise cancellation"
  },
  ...
]
```

## 🤖 LLM Integration

The chatbot uses **Groq API** (free tier available) for enhanced AI responses. The system includes:

- **Intent Detection**: Automatically detects user intent (order status, returns, recommendations, etc.)
- **Context-Aware Responses**: Uses synthetic data for accurate answers
- **Fallback to LLM**: For general questions, uses Groq's Llama 3.1 8B model
- **Smart Product Matching**: Matches products by category and tags

### Without API Key
The chatbot still works with rule-based responses, but may be less conversational for general queries.

### With API Key
Get enhanced, conversational responses while still using the synthetic data for accuracy.

## 📊 Sample Data

The application includes synthetic datasets:

**Orders** (`backend/data/orders.json`):
- Order IDs: ORD12345, ORD67890, ORD11111, ORD22222
- Statuses: Shipped, Processing, Delivered
- Customer information and expected delivery dates

**Products** (`backend/data/products.json`):
- Categories: Electronics, Accessories, Wearables
- Prices in Sri Lankan Rupees (Rs.)
- Tags for intelligent matching

**Return Policy**:
- Returns allowed within 14 days from delivery
- Product must be unused and in original packaging
- Refunds take 5–7 business days after inspection

## 🎨 Styling

The project uses **TailwindCSS** for styling with:
- Navy blue (#1e3a8a) as the primary color
- Clean white backgrounds
- Rounded containers
- Subtle shadows
- Responsive design

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
- Change the port in `backend/server.js` (default: 5000)

**Module not found errors:**
- Run `npm install` in the backend directory

**API Key not working:**
- Verify your Groq API key is correct
- Check that the environment variable is set correctly
- The app works without an API key, but with limited functionality

### Frontend Issues

**CORS errors:**
- Ensure backend is running on port 5000
- Check that CORS is enabled in `backend/server.js`

**Cannot connect to backend:**
- Verify backend is running: `http://localhost:5000/api/health`
- Check browser console for specific error messages
- Ensure both servers are running

**TailwindCSS not working:**
- Run `npm install` in the frontend directory
- Check that `tailwind.config.js` is properly configured
- Restart the dev server

### Chatbot Issues

**Chatbot not responding:**
- Check backend console for errors
- Verify backend is accessible at `http://localhost:5000`
- Check browser console for API errors

**LLM responses not working:**
- Verify Groq API key is set (optional)
- Check backend console for API errors
- The chatbot works without LLM, but with basic responses

## 📝 Code Comments

All code files include:
- Clear function documentation
- Inline comments for complex logic
- README sections for setup instructions

## 🔒 Environment Variables

Create a `.env` file in the `backend/` directory (optional):

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

## 📄 License

This project is provided as-is for educational purposes.

## 🙏 Credits

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **LLM**: Groq API (Llama 3.1 8B Instant)
- **Icons**: Heroicons (via TailwindCSS)

---

**Happy Coding! 🚀**

