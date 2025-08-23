import { Book } from './book.model';

export interface OrderItem {
  id: number;
  orderId: number; // Simplified from Order object
  book: Book; // Embed Book details
  price: number;
  quantity: number;
}

