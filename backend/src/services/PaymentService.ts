import { v4 as uuidv4 } from 'uuid';
import { IPaymentService } from './interfaces';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
}

/**
 * PaymentService — Simulated payment gateway.
 *
 * Implements IPaymentService so that a real gateway (Stripe, Razorpay)
 * can be substituted via the Strategy pattern without touching controllers
 * or BookingService — just pass a different IPaymentService implementation.
 */
export class PaymentService implements IPaymentService {
  processTransaction(amount: number, method: string): PaymentResult {
    // Simulated payment — always succeeds.
    // Replace with real gateway SDK call for production.
    return { success: true, transactionId: uuidv4() };
  }

  refundTransaction(transactionId: string): boolean {
    // Simulated refund — always succeeds.
    return true;
  }
}
