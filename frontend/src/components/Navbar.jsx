import React from 'react'

function Navbar() {
  return (
    <nav className="bg-navy text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">shopywiz</h1>
            <span className="text-sm text-blue-300">AI Customer Support</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className="hover:text-blue-300 transition">Home</a>
            <a href="#products" className="hover:text-blue-300 transition">Products</a>
            <a href="#about" className="hover:text-blue-300 transition">About</a>
            <a href="#contact" className="hover:text-blue-300 transition">Contact</a>
          </div>
          <button className="bg-white text-navy px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

