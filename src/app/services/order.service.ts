import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiErrorHandlingService } from './api-error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient,
    private errorHandler: ApiErrorHandlingService
  ) {}
  // Create a new order (checkout)
  createOrder(orderData: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, orderData)
      .pipe(catchError(this.handleError));
  }

  // Get order by ID
  getOrderById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get user's order history
  getUserOrders(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/user`)
      .pipe(catchError(this.handleError));
  }

  // Admin: Get all orders
  getAllOrders(page: number = 0, size: number = 10): Observable<any> {
    return this.http
      .get<any>(this.apiUrl, {
        params: { page: page.toString(), size: size.toString() },
      })
      .pipe(catchError(this.handleError));
  }

  // Admin: Update order status
  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}/status`, { status })
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

  etOrderStatistics(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/statistics`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getRecentOrders(limit: number = 10): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/recent?limit=${limit}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  cancelOrder(id: number, reason: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${id}/cancel`, { reason })
      .pipe(catchError(this.errorHandler.handleError));
  }
}