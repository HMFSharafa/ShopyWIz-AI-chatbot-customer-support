import React from 'react'

function Hero() {
  return (
    <section id="home" className="bg-gradient-to-r from-navy to-navy-light text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Welcome to shopywiz
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Your one-stop shop for the latest electronics and accessories
          </p>
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-6 mb-8">
            <p className="text-lg font-semibold mb-2">🎉 Special Promotion</p>
            <p className="text-blue-100">
              Free shipping on orders over Rs. 10,000! Use code: FREESHIP2025
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-navy px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg">
              Shop Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

