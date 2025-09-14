import { supabase } from '../config/database';
import { Payment } from '../types';

export class PaymentService {
  static async createPayment(paymentData: {
    job_id: string;
    customer_id: string;
    professional_id: string;
    amount: number;
    payment_method: string;
  }): Promise<Payment> {
    const commissionRate = 0.1; // 10% commission
    const commissionAmount = paymentData.amount * commissionRate;

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        ...paymentData,
        commission_amount: commissionAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create payment');
    }

    return payment;
  }

  static async processPayment(paymentId: string, transactionId: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        transaction_id: transactionId
      })
      .eq('id', paymentId);

    if (error) {
      throw new Error('Failed to process payment');
    }
  }

  static async getPaymentById(paymentId: string): Promise<Payment | null> {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) {
      return null;
    }

    return payment;
  }

  static async getUserPayments(userId: string): Promise<Payment[]> {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .or(`customer_id.eq.${userId},professional_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch user payments');
    }

    return payments || [];
  }

  static async refundPayment(paymentId: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('id', paymentId);

    if (error) {
      throw new Error('Failed to refund payment');
    }
  }

  static async getCommissionStats(): Promise<{
    totalCommission: number;
    totalPayments: number;
    averageCommission: number;
  }> {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('commission_amount')
      .eq('status', 'completed');

    if (error) {
      throw new Error('Failed to fetch commission stats');
    }

    const totalCommission = payments?.reduce((sum, payment) => sum + payment.commission_amount, 0) || 0;
    const totalPayments = payments?.length || 0;
    const averageCommission = totalPayments > 0 ? totalCommission / totalPayments : 0;

    return {
      totalCommission,
      totalPayments,
      averageCommission
    };
  }
}
