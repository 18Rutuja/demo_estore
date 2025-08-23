import { Book } from "./book.model";

export interface UserBook {
  id: number;
  userId: number; // Simplified from User object
  book: Book; // Embed Book details
  addedAt: string; // ISO Date string
}
