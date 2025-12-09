import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedProducts from './components/FeaturedProducts'
import Chatbot from './components/chatbot/Chatbot'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    // Fetch products from backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products')
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Use fallback data if API fails
        setProducts([
          {
            name: "Wireless Headphones",
            category: "Electronics",
            price: 8500,
            tags: ["audio", "bluetooth", "wireless"],
            description: "Premium wireless headphones with noise cancellation",
            image: "https://via.placeholder.com/300x300?text=Headphones"
          },
          {
            name: "USB-C Charger",
            category: "Accessories",
            price: 1500,
            tags: ["fast charging", "mobile"],
            description: "Fast charging USB-C cable and adapter",
            image: "https://via.placeholder.com/300x300?text=Charger"
          },
          {
            name: "Sports Smartwatch",
            category: "Wearables",
            price: 18500,
            tags: ["fitness", "waterproof", "health tracking"],
            description: "Advanced fitness tracking smartwatch with GPS",
            image: "https://via.placeholder.com/300x300?text=Smartwatch"
          }
        ])
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedProducts products={products} />
      <Chatbot />
    </div>
  )
}

export default App
