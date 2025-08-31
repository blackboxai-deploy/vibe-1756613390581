// Dropshipping supplier integration with mock API
import { SupplierProduct, SupplierOrder, Order } from '@/types'

// Mock supplier API configuration (for future use)
// const SUPPLIER_API_URL = 'https://api.mockfashionsupplier.com'
// const SUPPLIER_API_KEY = 'demo_supplier_key'

// Mock supplier product catalog
const mockSupplierProducts: SupplierProduct[] = [
  {
    id: 'SP_DRESS_001',
    sku: 'FMD-WRP-001',
    name: 'Floral Midi Wrap Dress',
    description: 'Elegant wrap dress featuring a beautiful floral print, perfect for both casual and formal occasions.',
    category: 'Dresses',
    price: 45.00, // Wholesale price
    stock: 150,
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/72ec375f-dc8e-49f9-a8c0-dfa2fdb1a853.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d3cde6a1-80fb-48dd-9de8-7e58f1027fff.png'
    ],
    attributes: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Rose Garden', 'Ocean Blue', 'Sage Green'],
      material: '95% Polyester, 5% Spandex',
      care: 'Machine wash cold, hang dry'
    },
    shipping: {
      weight: 0.8,
      dimensions: { length: 12, width: 8, height: 2 }
    }
  },
  {
    id: 'SP_DRESS_002',
    sku: 'LBD-CLS-002',
    name: 'Little Black Dress - Classic Fit',
    description: 'Timeless little black dress with a classic A-line silhouette.',
    category: 'Dresses',
    price: 38.00, // Wholesale price
    stock: 200,
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6c371b23-d4c1-4286-9999-e7a0ac69fd90.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ed894b48-502b-43d4-8928-844c6f4b1b2c.png'
    ],
    attributes: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black'],
      material: '92% Polyester, 8% Elastane',
      care: 'Machine wash cold, tumble dry low'
    },
    shipping: {
      weight: 0.7,
      dimensions: { length: 11, width: 8, height: 2 }
    }
  },
  {
    id: 'SP_TOP_003',
    sku: 'SLK-BTN-003',
    name: 'Silk Blend Button-Up Blouse',
    description: 'Luxurious silk blend blouse with mother-of-pearl buttons and subtle sheen.',
    category: 'Tops',
    price: 32.00, // Wholesale price
    stock: 180,
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c6348db8-a268-4594-97be-b935d402ae24.png',
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9f94adf9-9f8e-4df7-8ebf-e2bb793d58a3.png'
    ],
    attributes: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Ivory', 'Dusty Rose', 'Navy'],
      material: '70% Silk, 30% Polyester',
      care: 'Dry clean recommended or hand wash cold'
    },
    shipping: {
      weight: 0.4,
      dimensions: { length: 10, width: 8, height: 1 }
    }
  },
  {
    id: 'SP_BOTTOM_004',
    sku: 'HW-WL-004',
    name: 'High-Waisted Wide Leg Jeans',
    description: 'Vintage-inspired high-waisted jeans with wide leg silhouette.',
    category: 'Bottoms',
    price: 42.00, // Wholesale price
    stock: 120,
    images: [
      'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3b8a989c-c199-47f4-9c5d-0877ee4b8e02.png'
    ],
    attributes: {
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Classic Blue', 'Black'],
      material: '98% Cotton, 2% Elastane',
      care: 'Machine wash cold, tumble dry low'
    },
    shipping: {
      weight: 1.2,
      dimensions: { length: 14, width: 10, height: 3 }
    }
  }
]

// In-memory storage for mock supplier orders
const mockSupplierOrders = new Map<string, SupplierOrder>()

// Get all products from supplier
export async function getSupplierProducts(): Promise<SupplierProduct[]> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Fetching products from supplier API')
    
    return mockSupplierProducts.filter(product => product.stock > 0)
  } catch (error) {
    console.error('Failed to fetch supplier products:', error)
    throw new Error('Unable to connect to supplier API')
  }
}

// Get specific product by ID from supplier
export async function getSupplierProduct(productId: string): Promise<SupplierProduct | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const product = mockSupplierProducts.find(p => p.id === productId)
    return product || null
  } catch (error) {
    console.error('Failed to fetch supplier product:', error)
    return null
  }
}

// Check product availability and stock
export async function checkProductAvailability(productId: string, quantity: number): Promise<{
  available: boolean
  stock: number
  price: number
}> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const product = mockSupplierProducts.find(p => p.id === productId)
    
    if (!product) {
      return { available: false, stock: 0, price: 0 }
    }
    
    return {
      available: product.stock >= quantity,
      stock: product.stock,
      price: product.price
    }
  } catch (error) {
    console.error('Failed to check product availability:', error)
    return { available: false, stock: 0, price: 0 }
  }
}

// Create order with supplier
export async function createSupplierOrder(order: Order): Promise<SupplierOrder> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Creating supplier order for order ID:', order.id)
    
    // Convert order items to supplier format
    const supplierOrderItems = order.items.map(item => ({
      productId: item.product.supplierProductId,
      sku: item.product.supplierSku,
      quantity: item.quantity,
      price: item.price * 0.5 // Assuming 50% wholesale price
    }))
    
    // Create supplier order
    const supplierOrder: SupplierOrder = {
      id: `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      orderId: order.id,
      items: supplierOrderItems,
      status: 'pending',
      shippingCost: order.shipping,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Store in mock database
    mockSupplierOrders.set(supplierOrder.id, supplierOrder)
    
    console.log('Supplier order created:', supplierOrder.id)
    
    // Simulate automatic confirmation after delay
    setTimeout(() => {
      confirmSupplierOrder(supplierOrder.id)
    }, 2000)
    
    return supplierOrder
  } catch (error) {
    console.error('Failed to create supplier order:', error)
    throw new Error('Unable to place order with supplier')
  }
}

// Confirm supplier order (internal method)
async function confirmSupplierOrder(supplierOrderId: string): Promise<void> {
  const supplierOrder = mockSupplierOrders.get(supplierOrderId)
  if (supplierOrder) {
    supplierOrder.status = 'confirmed'
    supplierOrder.updatedAt = new Date()
    
    console.log('Supplier order confirmed:', supplierOrderId)
    
    // Simulate shipping after confirmation
    setTimeout(() => {
      shipSupplierOrder(supplierOrderId)
    }, 24 * 60 * 60 * 1000) // Ship after 1 day
  }
}

// Ship supplier order (internal method)
async function shipSupplierOrder(supplierOrderId: string): Promise<void> {
  const supplierOrder = mockSupplierOrders.get(supplierOrderId)
  if (supplierOrder && supplierOrder.status === 'confirmed') {
    supplierOrder.status = 'shipped'
    supplierOrder.trackingNumber = generateTrackingNumber()
    supplierOrder.updatedAt = new Date()
    
    console.log('Supplier order shipped:', supplierOrderId, 'Tracking:', supplierOrder.trackingNumber)
  }
}

// Get supplier order status
export async function getSupplierOrderStatus(supplierOrderId: string): Promise<SupplierOrder | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return mockSupplierOrders.get(supplierOrderId) || null
  } catch (error) {
    console.error('Failed to get supplier order status:', error)
    return null
  }
}

// Update product inventory from supplier
export async function syncInventoryFromSupplier(): Promise<{ updated: number; errors: string[] }> {
  try {
    console.log('Syncing inventory from supplier...')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate inventory updates
    let updated = 0
    const errors: string[] = []
    
    for (const product of mockSupplierProducts) {
      try {
        // Simulate random stock changes
        const stockChange = Math.floor(Math.random() * 20) - 10 // -10 to +10
        product.stock = Math.max(0, product.stock + stockChange)
        updated++
      } catch (error) {
        errors.push(`Failed to update ${product.sku}: ${error}`)
      }
    }
    
    console.log('Inventory sync completed:', { updated, errors: errors.length })
    
    return { updated, errors }
  } catch (error) {
    console.error('Inventory sync failed:', error)
    throw new Error('Unable to sync inventory with supplier')
  }
}

// Generate tracking number
function generateTrackingNumber(): string {
  const carriers = ['1Z', '1T', '94'] // UPS, FedEx, USPS prefixes
  const carrier = carriers[Math.floor(Math.random() * carriers.length)]
  const number = Math.random().toString(36).substr(2, 12).toUpperCase()
  
  return `${carrier}${number}`
}

// Webhook handler for supplier updates
export async function handleSupplierWebhook(payload: any): Promise<{ processed: boolean; message: string }> {
  try {
    console.log('Processing supplier webhook:', payload.type)
    
    switch (payload.type) {
      case 'order.shipped':
        const supplierOrder = mockSupplierOrders.get(payload.data.orderId)
        if (supplierOrder) {
          supplierOrder.status = 'shipped'
          supplierOrder.trackingNumber = payload.data.trackingNumber
          supplierOrder.updatedAt = new Date()
        }
        return { processed: true, message: 'Order shipping status updated' }
        
      case 'inventory.updated':
        // Update inventory for specific products
        payload.data.products.forEach((update: any) => {
          const product = mockSupplierProducts.find(p => p.id === update.productId)
          if (product) {
            product.stock = update.stock
            product.price = update.price
          }
        })
        return { processed: true, message: 'Inventory updated successfully' }
        
      case 'order.cancelled':
        const cancelledOrder = mockSupplierOrders.get(payload.data.orderId)
        if (cancelledOrder) {
          cancelledOrder.status = 'cancelled'
          cancelledOrder.updatedAt = new Date()
        }
        return { processed: true, message: 'Order cancellation processed' }
        
      default:
        return { processed: false, message: 'Unknown webhook type' }
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return { processed: false, message: 'Webhook processing failed' }
  }
}

// Calculate shipping cost from supplier
export function calculateSupplierShipping(items: any[], shippingAddress: any): number {
  // Simple weight-based calculation
  const totalWeight = items.reduce((weight, item) => {
    const supplierProduct = mockSupplierProducts.find(p => p.id === item.productId)
    return weight + (supplierProduct ? supplierProduct.shipping.weight * item.quantity : 0)
  }, 0)
  
  // Base shipping cost calculation
  let shippingCost = 5.99 // Base cost
  
  if (totalWeight > 2) {
    shippingCost += (totalWeight - 2) * 2.50 // Additional weight cost
  }
  
  // International shipping surcharge
  if (shippingAddress.country !== 'US') {
    shippingCost += 15.00
  }
  
  return Math.round(shippingCost * 100) / 100 // Round to 2 decimal places
}

// Get supplier performance metrics
export async function getSupplierMetrics(): Promise<{
  orderFulfillmentRate: number
  averageProcessingTime: number
  inventoryAccuracy: number
  shippingAccuracy: number
}> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mock metrics for demo
    return {
      orderFulfillmentRate: 98.5,
      averageProcessingTime: 1.8, // days
      inventoryAccuracy: 96.2,
      shippingAccuracy: 97.8
    }
  } catch (error) {
    console.error('Failed to get supplier metrics:', error)
    throw new Error('Unable to fetch supplier performance data')
  }
}