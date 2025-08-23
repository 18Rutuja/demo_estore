export interface Category {
  id: number;
  name: string;
  description?: string;
  // books: Book[]; // Avoid circular dependencies in basic models, handle relationships separately if needed
}

