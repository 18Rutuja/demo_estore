import { PaymentMethod } from "./payment-method.enum";
import { PaymentStatus } from "./payment-status.enum";

export interface Payment {
  id: number;
  orderId: number; // Simplified from Order object
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  paymentDate: string; // ISO Date string
}