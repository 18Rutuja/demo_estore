import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiErrorHandlingService } from './api-error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private errorHandler: ApiErrorHandlingService
  ) {}

    getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  // Get current user profile
  getCurrentUser(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/profile`)
      .pipe(catchError(this.handleError));
  }

  // Update user profile
  updateProfile(userData: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/profile`, userData)
      .pipe(catchError(this.handleError));
  }

  // Change password
  changePassword(passwordData: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/change-password`, passwordData)
      .pipe(catchError(this.handleError));
  }

  // Get user's library (purchased books)
  getUserLibrary(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/library`)
      .pipe(catchError(this.handleError));
  }

  // Admin: Get all users
  getAllUsers(page: number = 0, size: number = 10): Observable<any> {
    return this.http
      .get<any>(this.apiUrl, {
        params: { page: page.toString(), size: size.toString() },
      })
      .pipe(catchError(this.handleError));
  }

  // Admin: Get user by ID
  getUserById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Admin: Update user
  updateUser(id: number, userData: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, userData)
      .pipe(catchError(this.handleError));
  }

  // Admin: Delete user
  deleteUser(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/profile`, userData)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getOrderHistory(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/orders`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getWishlist(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/wishlist`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  addToWishlist(bookId: number): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/wishlist`, { bookId })
      .pipe(catchError(this.errorHandler.handleError));
  }

  removeFromWishlist(bookId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/wishlist/${bookId}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  updateEmailPreferences(preferences: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/email-preferences`, preferences)
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteAccount(): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/account`)
      .pipe(catchError(this.errorHandler.handleError));
  }
}
