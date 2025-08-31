// Database utilities and mock data for the dropshipping platform
import { Product, User, Order, Review, CartItem, ProductCategory } from '@/types'

// In-memory database simulation (in production, use SQLite/PostgreSQL)
class MockDatabase {
  private users: Map<string, User> = new Map()
  private products: Map<string, Product> = new Map()
  private orders: Map<string, Order> = new Map()
  private carts: Map<string, CartItem[]> = new Map()

  constructor() {
    this.seedData()
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.users.set(user.id, user)
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user
    }
    return null
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  // Product operations
  async getProducts(filters?: {
    category?: ProductCategory
    search?: string
    limit?: number
    offset?: number
    featured?: boolean
  }): Promise<{ products: Product[], total: number }> {
    let products = Array.from(this.products.values()).filter(p => p.isActive)

    if (filters?.category) {
      products = products.filter(p => p.category === filters.category)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters?.featured) {
      products = products.filter(p => p.isFeatured)
    }

    const total = products.length
    const offset = filters?.offset || 0
    const limit = filters?.limit || 20

    products = products.slice(offset, offset + limit)

    return { products, total }
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.isFeatured && p.isActive)
      .slice(0, 8)
  }

  async getBestSellers(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.isActive)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 12)
  }

  // Order operations
  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}`
    const order: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.orders.set(order.id, order)
    return order
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Cart operations
  async getCart(sessionId: string): Promise<CartItem[]> {
    return this.carts.get(sessionId) || []
  }

  async updateCart(sessionId: string, items: CartItem[]): Promise<void> {
    this.carts.set(sessionId, items)
  }

  // Seed initial data
  private seedData() {
    // Seed best-selling women's clothing products
    const products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
      // Dresses
      {
        name: "Floral Midi Wrap Dress",
        description: "Elegant wrap dress featuring a beautiful floral print, perfect for both casual and formal occasions. Made from lightweight, breathable fabric with a flattering wrap silhouette.",
        category: "dresses",
        subcategory: "midi-dresses",
        price: 89.99,
        compareAtPrice: 129.99,
        images: [
          { id: "1", url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ca3e42b7-dd4b-4566-98b1-aaecca347b78.png", alt: "Floral Midi Wrap Dress - Front View", isMain: true, order: 1 },
          { id: "2", url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8461279b-4033-4c81-9600-a489427573a7.png", alt: "Floral Midi Wrap Dress - Side View", isMain: false, order: 2 }
        ],
        sizes: [
          { size: "XS", available: true },
          { size: "S", available: true },
          { size: "M", available: true },
          { size: "L", available: true },
          { size: "XL", available: false }
        ],
        colors: [
          { name: "Rose Garden", hex: "#F8BBD9", available: true },
          { name: "Ocean Blue", hex: "#4A90E2", available: true },
          { name: "Sage Green", hex: "#87A96B", available: true }
        ],
        materials: ["95% Polyester", "5% Spandex"],
        care: ["Machine wash cold", "Hang dry", "Low iron if needed"],
        stock: 45,
        supplierProductId: "SP_DRESS_001",
        supplierSku: "FMD-WRP-001",
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 127
      },
      {
        name: "Little Black Dress - Classic Fit",
        description: "Timeless little black dress with a classic A-line silhouette. Perfect for dinner dates, cocktail parties, or professional events. Features subtle texture and comfortable stretch.",
        category: "dresses",
        subcategory: "cocktail-dresses",
        price: 79.99,
        compareAtPrice: 119.99,
        images: [
          { id: "3", url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/37dc7068-5243-4187-a160-01efe97dceb4.png", alt: "Little Black Dress - Classic Fit", isMain: true, order: 1 },
          { id: "4", url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1db039b4-11a9-44b8-89bd-7099e8dda9c6.png", alt: "Little Black Dress - Back View", isMain: false, order: 2 }
        ],
        sizes: [
          { size: "XS", available: true },
          { size: "S", available: true },
          { size: "M", available: true },
          { size: "L", available: true },
          { size: "XL", available: true }
        ],
        colors: [{ name: "Classic Black", hex: "#000000", available: true }],
        materials: ["92% Polyester", "8% Elastane"],
        care: ["Machine wash cold", "Tumble dry low", "Steam or iron on low"],
        stock: 67,
        supplierProductId: "SP_DRESS_002",
        supplierSku: "LBD-CLS-002",
        isActive: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 203
      },

      // Tops
      {
        name: "Silk Blend Button-Up Blouse",
        description: "Luxurious silk blend blouse with mother-of-pearl buttons and subtle sheen. Perfect for office wear or elevated casual looks. Features a relaxed fit with elegant drape.",
        category: "tops",
        subcategory: "blouses",
        price: 69.99,
        compareAtPrice: 99.99,
        images: [
          { id: "5", url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ed3d54c9-ea9b-44d4-a946-b1b99a6e3408.png", alt: "Silk Blend Button-Up Blouse", isMain: true, order: 1 },
          { id: "6", url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d958344a-9698-4315-83cd-d75fa45530e6.png", alt: "Silk Blouse - Detail View", isMain: false, order: 2 }
        ],
        sizes: [
          { size: "XS", available: true },
          { size: "S", available: true },
          { size: "M", available: true },
          { size: "L", available: true },
          { size: "XL", available: true }
        ],
        colors: [
          { name: "Ivory", hex: "#F8F8F0", available: true },
          { name: "Dusty Rose", hex: "#D4A5A5", available: true },
          { name: "Navy", hex: "#1B263B", available: true }
        ],
        materials: ["70% Silk", "30% Polyester"],
        care: ["Dry clean recommended", "Or hand wash cold", "Lay flat to dry"],
        stock: 52,
        supplierProductId: "SP_TOP_003",
        supplierSku: "SLK-BTN-003",
        isActive: true,
        isFeatured: true,
        rating: 4.7,
        reviewCount: 89
      },

      // More products...
      {
        name: "High-Waisted Wide Leg Jeans",
        description: "Vintage-inspired high-waisted jeans with wide leg silhouette. Made from premium stretch denim for comfort and style. Perfect for creating effortlessly chic looks.",
        category: "bottoms",
        subcategory: "jeans",
        price: 95.99,
        compareAtPrice: 135.99,
        images: [
          { id: "7", url: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6d92a513-74d2-4093-9e93-7bd41b804c71.png", alt: "High-Waisted Wide Leg Jeans", isMain: true, order: 1 }
        ],
        sizes: [
          { size: "XS", available: true },
          { size: "S", available: true },
          { size: "M", available: true },
          { size: "L", available: true },
          { size: "XL", available: true }
        ],
        colors: [
          { name: "Classic Blue", hex: "#4F7CAC", available: true },
          { name: "Black", hex: "#2C2C2C", available: true }
        ],
        materials: ["98% Cotton", "2% Elastane"],
        care: ["Machine wash cold", "Tumble dry low", "Iron on medium heat"],
        stock: 38,
        supplierProductId: "SP_BOTTOM_004",
        supplierSku: "HW-WL-004",
        isActive: true,
        isFeatured: true,
        rating: 4.6,
        reviewCount: 156
      }
    ]

    // Add products to database
    products.forEach((productData) => {
      const product: Product = {
        ...productData,
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.products.set(product.id, product)
    })
  }

  // Analytics methods
  async getSalesAnalytics(): Promise<{
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
  }> {
    const orders = Array.from(this.orders.values())
    const completedOrders = orders.filter(o => o.status === 'delivered')
    
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = completedOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue
    }
  }
}

// Export singleton instance
export const db = new MockDatabase()

// Helper functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export const generateOrderNumber = (): string => {
  return `ORD-${Date.now().toString()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
}

export const calculateTax = (subtotal: number, taxRate: number = 0.08): number => {
  return subtotal * taxRate
}

export const calculateShipping = (subtotal: number): number => {
  return subtotal >= 75 ? 0 : 9.99
}