import { Payment } from '../interfaces/Payment';

export type PaymentWithBusinessName = Payment & { businessName: string };
export type PaymentInsertData = Omit<Payment, 'id' | 'timestamp'>;
