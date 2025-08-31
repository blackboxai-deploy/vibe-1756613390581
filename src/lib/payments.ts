// Payment processing utilities for Stripe, PayPal, and Authorize.Net
import { PaymentMethod, Order } from '@/types'

// Stripe Configuration
export const stripeConfig = {
  publicKey: 'pk_test_demo', // Replace with process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in production
  secretKey: 'sk_test_demo', // Replace with process.env.STRIPE_SECRET_KEY in production
  webhookSecret: 'whsec_demo' // Replace with process.env.STRIPE_WEBHOOK_SECRET in production
}

// PayPal Configuration
export const paypalConfig = {
  clientId: 'demo_paypal_client_id', // Replace with process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID in production
  clientSecret: 'demo_paypal_secret', // Replace with process.env.PAYPAL_CLIENT_SECRET in production
  environment: 'sandbox' // Change to 'production' for live environment
}

// Authorize.Net Configuration
export const authorizeNetConfig = {
  apiLoginId: 'demo_login_id', // Replace with process.env.AUTHORIZE_NET_API_LOGIN_ID in production
  transactionKey: 'demo_transaction_key', // Replace with process.env.AUTHORIZE_NET_TRANSACTION_KEY in production
  environment: 'sandbox' // Change to 'production' for live environment
}

// Payment processing results
export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  details?: any
}

// Create Stripe Payment Intent
export async function createStripePaymentIntent(order: Order): Promise<PaymentResult> {
  try {
    // Mock Stripe Payment Intent creation for demo
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 8)}`,
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      status: 'requires_payment_method'
    }

    console.log('Created Stripe Payment Intent:', paymentIntent.id)
    
    return {
      success: true,
      transactionId: paymentIntent.id,
      details: paymentIntent
    }
  } catch (error) {
    console.error('Stripe payment error:', error)
    return {
      success: false,
      error: 'Failed to create payment intent'
    }
  }
}

// Process Stripe Payment
export async function processStripePayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResult> {
  try {
    // Mock Stripe payment confirmation for demo
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
    
    console.log('Processing payment with method:', paymentMethodId)
    
    const confirmed = Math.random() > 0.1 // 90% success rate for demo
    
    if (confirmed) {
      return {
        success: true,
        transactionId: paymentIntentId,
        details: {
          id: paymentIntentId,
          status: 'succeeded',
          charges: {
            data: [{
              id: `ch_${Date.now()}`,
              paid: true,
              status: 'succeeded'
            }]
          }
        }
      }
    } else {
      return {
        success: false,
        error: 'Payment declined by card issuer'
      }
    }
  } catch (error) {
    console.error('Stripe payment processing error:', error)
    return {
      success: false,
      error: 'Payment processing failed'
    }
  }
}

// Create PayPal Order
export async function createPayPalOrder(order: Order): Promise<PaymentResult> {
  try {
    // Mock PayPal order creation for demo
    const paypalOrder = {
      id: `PAY-${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'CREATED',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: order.total.toFixed(2)
        }
      }],
      links: [{
        href: `https://sandbox.paypal.com/checkoutnow?token=PAY-${Date.now()}`,
        rel: 'approve',
        method: 'GET'
      }]
    }

    console.log('Created PayPal Order:', paypalOrder.id)
    
    return {
      success: true,
      transactionId: paypalOrder.id,
      details: paypalOrder
    }
  } catch (error) {
    console.error('PayPal order creation error:', error)
    return {
      success: false,
      error: 'Failed to create PayPal order'
    }
  }
}

// Capture PayPal Payment
export async function capturePayPalPayment(orderId: string): Promise<PaymentResult> {
  try {
    // Mock PayPal payment capture for demo
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
    
    const captured = Math.random() > 0.05 // 95% success rate for demo
    
    if (captured) {
      return {
        success: true,
        transactionId: orderId,
        details: {
          id: orderId,
          status: 'COMPLETED',
          purchase_units: [{
            payments: {
              captures: [{
                id: `CAP-${Date.now()}`,
                status: 'COMPLETED',
                amount: {
                  currency_code: 'USD',
                  value: '100.00'
                }
              }]
            }
          }]
        }
      }
    } else {
      return {
        success: false,
        error: 'PayPal payment could not be captured'
      }
    }
  } catch (error) {
    console.error('PayPal payment capture error:', error)
    return {
      success: false,
      error: 'Payment capture failed'
    }
  }
}

// Process Authorize.Net Payment
export async function processAuthorizeNetPayment(order: Order, paymentData: any): Promise<PaymentResult> {
  try {
    // Mock Authorize.Net payment processing for demo
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
    
    console.log('Processing Authorize.Net payment for order:', order.id)
    console.log('Payment data received:', paymentData)
    
    const approved = Math.random() > 0.08 // 92% success rate for demo
    
    if (approved) {
      const transactionId = `AUTH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      
      return {
        success: true,
        transactionId,
        details: {
          transactionResponse: {
            responseCode: '1', // Approved
            authCode: `AUTH${Date.now().toString().slice(-6)}`,
            transId: transactionId,
            messages: [{
              code: '1',
              description: 'This transaction has been approved.'
            }]
          }
        }
      }
    } else {
      return {
        success: false,
        error: 'Transaction declined',
        details: {
          transactionResponse: {
            responseCode: '2', // Declined
            messages: [{
              code: '2',
              description: 'This transaction has been declined.'
            }]
          }
        }
      }
    }
  } catch (error) {
    console.error('Authorize.Net payment error:', error)
    return {
      success: false,
      error: 'Payment processing failed'
    }
  }
}

// Process Refund
export async function processRefund(paymentMethod: PaymentMethod, transactionId: string, amount: number): Promise<PaymentResult> {
  try {
    // Mock refund processing for demo
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const refundId = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
    
    console.log(`Processing ${paymentMethod} refund:`, { transactionId, amount, refundId })
    
    return {
      success: true,
      transactionId: refundId,
      details: {
        refundId,
        amount,
        status: 'processing'
      }
    }
  } catch (error) {
    console.error('Refund processing error:', error)
    return {
      success: false,
      error: 'Refund processing failed'
    }
  }
}

// Verify Payment Webhook
export function verifyWebhook(payload: string, signature: string, paymentMethod: PaymentMethod): boolean {
  // Mock webhook verification for demo
  console.log(`Verifying ${paymentMethod} webhook signature:`, signature.substring(0, 20) + '...')
  
  // In production, implement proper signature verification for each payment method
  return signature.length > 0 && payload.length > 0
}

// Get Payment Method Display Name
export function getPaymentMethodName(method: PaymentMethod): string {
  const names = {
    stripe_card: 'Credit/Debit Card',
    stripe_apple_pay: 'Apple Pay',
    stripe_google_pay: 'Google Pay',
    paypal: 'PayPal',
    authorize_net: 'Credit Card (Authorize.Net)'
  }
  
  return names[method] || 'Unknown Payment Method'
}

// Calculate Processing Fees
export function calculateProcessingFee(amount: number, method: PaymentMethod): number {
  const fees = {
    stripe_card: 0.029, // 2.9%
    stripe_apple_pay: 0.029,
    stripe_google_pay: 0.029,
    paypal: 0.031, // 3.1%
    authorize_net: 0.025 // 2.5%
  }
  
  const feeRate = fees[method] || 0.03
  return Math.round(amount * feeRate * 100) / 100 // Round to 2 decimal places
}

// Validate Payment Data
export function validatePaymentData(method: PaymentMethod, data: any): { valid: boolean; error?: string } {
  switch (method) {
    case 'stripe_card':
      if (!data.paymentMethodId) {
        return { valid: false, error: 'Payment method ID is required' }
      }
      break
      
    case 'paypal':
      if (!data.orderId) {
        return { valid: false, error: 'PayPal order ID is required' }
      }
      break
      
    case 'authorize_net':
      if (!data.cardNumber || !data.expirationDate || !data.cardCode) {
        return { valid: false, error: 'Credit card information is incomplete' }
      }
      break
      
    default:
      return { valid: false, error: 'Unsupported payment method' }
  }
  
  return { valid: true }
}