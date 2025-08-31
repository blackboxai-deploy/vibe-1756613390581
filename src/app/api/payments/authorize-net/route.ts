import { NextRequest, NextResponse } from 'next/server'
import { processAuthorizeNetPayment } from '@/lib/payments'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentData } = body

    // Get order details
    const order = await db.getOrderById(orderId)
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found'
          }
        },
        { status: 404 }
      )
    }

    // Process Authorize.Net Payment
    const result = await processAuthorizeNetPayment(order, paymentData)
    
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTHORIZE_NET_ERROR',
            message: result.error || 'Authorize.Net payment processing failed'
          }
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        transactionId: result.transactionId,
        status: 'approved',
        details: result.details
      }
    })
  } catch (error) {
    console.error('Authorize.Net payment API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'AUTHORIZE_NET_ERROR',
          message: 'Authorize.Net payment processing failed'
        }
      },
      { status: 500 }
    )
  }
}