import { OrderItem } from "./order-item.model";
import { OrderStatus } from "./order-status.enum";
import { Payment } from "./payment.model";

export interface Order {
  id: number;
  orderNumber: string;
  userId: number; // Simplified from User object
  orderItems?: OrderItem[]; // Embed order items
  totalAmount: number;
  status: OrderStatus;
  payment?: Payment; // Embed payment details
  createdAt: string; // ISO Date string
  updatedAt?: string; // ISO Date string
}