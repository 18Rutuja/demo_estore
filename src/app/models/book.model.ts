import { Category } from './category.model';
import { Review } from './review.model';

export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  isbn?: string;
  publisher?: string;
  publicationDate?: string; // ISO Date string
  language?: string;
  pageCount?: number;
  coverImageUrl: string;
  sampleUrl?: string;
  fileUrl?: string;
  featured: boolean;
  bestseller: boolean;
  newRelease: boolean;
  categories?: Category[]; // Embed categories
  reviews?: Review[]; // Embed reviews
  createdAt: string; // ISO Date string
  updatedAt?: string; // ISO Date string
}

