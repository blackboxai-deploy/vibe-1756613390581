// Core type definitions for the dropshipping platform

export interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  subcategory: string
  price: number
  compareAtPrice?: number
  images: ProductImage[]
  sizes: ProductSize[]
  colors: ProductColor[]
  materials: string[]
  care: string[]
  stock: number
  supplierProductId: string
  supplierSku: string
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isMain: boolean
  order: number
}

export interface ProductSize {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
  available: boolean
  measurements?: {
    bust?: number
    waist?: number
    hips?: number
    length?: number
  }
}

export interface ProductColor {
  name: string
  hex: string
  available: boolean
}

export type ProductCategory = 
  | 'dresses'
  | 'tops'
  | 'bottoms' 
  | 'outerwear'
  | 'activewear'
  | 'accessories'

export interface CartItem {
  id: string
  productId: string
  product: Product
  size: string
  color: string
  quantity: number
  price: number
}

export interface Cart {
  id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId?: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  paymentId: string
  shippingAddress: Address
  billingAddress: Address
  supplierOrderId?: string
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  size: string
  color: string
  quantity: number
  price: number
  supplierOrderItemId?: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'

export type PaymentMethod = 
  | 'stripe_card'
  | 'stripe_apple_pay'
  | 'stripe_google_pay'
  | 'paypal'
  | 'authorize_net'

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

export interface Review {
  id: string
  productId: string
  userId?: string
  userName: string
  email: string
  rating: number
  title: string
  content: string
  verified: boolean
  helpful: number
  createdAt: Date
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: Date
}

export interface SupplierProduct {
  id: string
  sku: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  images: string[]
  attributes: Record<string, any>
  shipping: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
  }
}

export interface SupplierOrder {
  id: string
  orderId: string
  items: SupplierOrderItem[]
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  shippingCost: number
  createdAt: Date
  updatedAt: Date
}

export interface SupplierOrderItem {
  productId: string
  sku: string
  quantity: number
  price: number
}

// Search and filtering types
export interface ProductFilters {
  category?: ProductCategory
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  inStock?: boolean
  onSale?: boolean
  rating?: number
}

export interface SearchResults {
  products: Product[]
  total: number
  page: number
  limit: number
  filters: ProductFilters
}

// Analytics types
export interface SalesAnalytics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  topSellingProducts: Product[]
  revenueByCategory: Record<ProductCategory, number>
  revenueByMonth: Record<string, number>
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface CheckoutFormData {
  email: string
  shippingAddress: Address
  billingAddress: Address
  sameAsBilling: boolean
  paymentMethod: PaymentMethod
  saveInfo: boolean
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Payment processor specific types
export interface StripePaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

export interface PayPalPayment {
  id: string
  status: string
  amount: {
    total: string
    currency: string
  }
}

export interface AuthorizeNetPayment {
  transactionId: string
  responseCode: string
  messageCode: string
  description: string
  amount: string
}