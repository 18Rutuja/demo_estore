
export interface Review {
  id: number;
  bookId: number; // Simplified from Book object
  userId: number; // Simplified from User object
  rating: number;
  comment?: string;
  createdAt: string; // ISO Date string
  updatedAt?: string; // ISO Date string
}

