import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  // Get reviews for a book
  getBookReviews(bookId: number): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/books/${bookId}/reviews`)
      .pipe(catchError(this.handleError));
  }

  // Add a review for a book
  addReview(bookId: number, reviewData: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/books/${bookId}/reviews`, reviewData)
      .pipe(catchError(this.handleError));
  }

  // Update a review
  updateReview(reviewId: number, reviewData: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${reviewId}`, reviewData)
      .pipe(catchError(this.handleError));
  }

  // Delete a review
  deleteReview(reviewId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${reviewId}`)
      .pipe(catchError(this.handleError));
  }

  // Get user's reviews
  getUserReviews(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/user`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error && error.error.message) {
      // Server-side error with message
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.message) {
      // Client-side error or general error
      errorMessage = `Error: ${error.message}`;
    } else {
      // Unknown error
      errorMessage = 'An unknown error occurred';
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
