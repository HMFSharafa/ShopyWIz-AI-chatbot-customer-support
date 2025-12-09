import React, { useMemo } from 'react'

const FALLBACK_IMAGE = '/fallback-product.svg'

const resolveImage = (product) => {
  if (product?.image) {
    const trimmed = String(product.image).trim()
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    return `/${trimmed.replace(/^\//, '')}`
  }
  return null
}

function FeaturedProducts({ products }) {
  // Display first 6 products
  const featuredProducts = useMemo(() => products.slice(0, 6), [products])

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => {
            const fallback = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`
            const src = resolveImage(product) || fallback

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 border border-gray-100"
              >
                <div className="h-64 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={src}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition duration-500 ease-out hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE
                    }}
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-xl font-semibold text-navy">{product.name}</h3>
                    <span className="bg-blue-100 text-primary-600 text-xs px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-muted text-sm line-clamp-2">
                    {product.description || 'Premium quality product'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      Rs. {Number(product.price || 0).toLocaleString()}
                    </span>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition shadow-sm hover:shadow-md">
                      Add to Cart
                    </button>
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {product.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-blue-50 text-primary-600 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">Loading products...</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts

