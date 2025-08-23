import { Role } from './role.model';

export interface User {
  id: number;
  email: string;
  // password should not be sent to frontend
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  enabled: boolean;
  roles?: Role[]; // Embed roles
  // reviews: Review[]; // Avoid circular dependencies
  // orders: Order[]; // Avoid circular dependencies
  createdAt: string; // ISO Date string
  updatedAt?: string; // ISO Date string
}

