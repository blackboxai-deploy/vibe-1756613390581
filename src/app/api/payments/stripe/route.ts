import { NextRequest, NextResponse } from 'next/server'
import { createStripePaymentIntent, processStripePayment } from '@/lib/payments'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, orderId, paymentIntentId, paymentMethodId } = body

    switch (action) {
      case 'create_payment_intent':
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

        // Create Stripe Payment Intent
        const result = await createStripePaymentIntent(order)
        
        if (!result.success) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'PAYMENT_INTENT_ERROR',
                message: result.error || 'Failed to create payment intent'
              }
            },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          data: {
            paymentIntent: result.details,
            clientSecret: result.details?.client_secret
          }
        })

      case 'confirm_payment':
        // Process Stripe Payment
        const paymentResult = await processStripePayment(paymentIntentId, paymentMethodId)
        
        if (!paymentResult.success) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'PAYMENT_FAILED',
                message: paymentResult.error || 'Payment processing failed'
              }
            },
            { status: 400 }
          )
        }

        return NextResponse.json({
          success: true,
          data: {
            transactionId: paymentResult.transactionId,
            status: 'succeeded'
          }
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ACTION',
              message: 'Invalid payment action'
            }
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Stripe payment API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'STRIPE_ERROR',
          message: 'Stripe payment processing failed'
        }
      },
      { status: 500 }
    )
  }
}