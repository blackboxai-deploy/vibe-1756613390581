import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProductCategory } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const category = searchParams.get('category') as ProductCategory | null
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get products with filters
    const result = await db.getProducts({
      category: category || undefined,
      search: search || undefined,
      featured: featured || undefined,
      limit,
      offset
    })

    // Calculate pagination
    const totalPages = Math.ceil(result.total / limit)

    return NextResponse.json({
      success: true,
      data: result.products,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PRODUCTS_ERROR',
          message: 'Failed to fetch products'
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // This would be used by admin to create new products
    const data = await request.json()
    
    // TODO: Implement product creation
    // const product = await db.createProduct(data)
    
    console.log('Product creation request:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Product creation endpoint - admin functionality'
    })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_PRODUCT_ERROR',
          message: 'Failed to create product'
        }
      },
      { status: 500 }
    )
  }
}