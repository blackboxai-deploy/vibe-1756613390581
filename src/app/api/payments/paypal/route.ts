import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder, capturePayPalPayment } from '@/lib/payments'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, orderId, paypalOrderId } = body

    switch (action) {
      case 'create_order':
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

        // Create PayPal Order
        const result = await createPayPalOrder(order)
        
        if (!result.success) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'PAYPAL_ORDER_ERROR',
                message: result.error || 'Failed to create PayPal order'
              }
            },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          data: {
            paypalOrder: result.details,
            orderId: result.transactionId
          }
        })

      case 'capture_payment':
        // Capture PayPal Payment
        const captureResult = await capturePayPalPayment(paypalOrderId)
        
        if (!captureResult.success) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'PAYPAL_CAPTURE_ERROR',
                message: captureResult.error || 'Failed to capture PayPal payment'
              }
            },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          data: {
            transactionId: captureResult.transactionId,
            status: 'completed'
          }
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ACTION',
              message: 'Invalid PayPal action'
            }
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('PayPal payment API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PAYPAL_ERROR',
          message: 'PayPal payment processing failed'
        }
      },
      { status: 500 }
    )
  }
}