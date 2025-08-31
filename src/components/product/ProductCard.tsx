'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/db'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const mainImage = product.images.find(img => img.isMain) || product.images[0]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist API call
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product.id)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="group relative bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {!imageError ? (
            <img
              src={mainImage?.url || 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4b28a4f8-4ff0-44ec-b968-b4658777f280.png'}
              alt={mainImage?.alt || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <p className="text-sm mt-2">Image unavailable</p>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                -{Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}%
              </Badge>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="outline" className="bg-white/90">
                Only {product.stock} left
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="bg-gray-500">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 w-9 h-9 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
            onClick={handleWishlistToggle}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor" 
              strokeWidth="2"
              className={isWishlisted ? "text-red-500" : ""}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </Button>

          {/* Quick Add to Cart - Shown on Hover */}
          {product.stock > 0 && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                className="w-full bg-white/90 hover:bg-white text-black backdrop-blur-sm"
                onClick={handleAddToCart}
              >
                Quick Add
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category.replace('-', ' ')}
          </p>

          {/* Product Name */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Available Colors */}
          <div className="mt-3">
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.name}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.colors.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard