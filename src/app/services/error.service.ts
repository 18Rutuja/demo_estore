import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  // Handle HTTP errors
  handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = `Bad Request: ${this.getServerErrorMessage(error)}`;
          break;
        case 401:
          errorMessage = 'Unauthorized: Please log in again.';
          break;
        case 403:
          errorMessage =
            'Forbidden: You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource does not exist.';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later.';
          break;
        default:
          errorMessage = `Unknown Error: ${this.getServerErrorMessage(error)}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Extract server error message
  private getServerErrorMessage(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object') {
      if (error.error.message) {
        return error.error.message;
      } else if (error.error.error) {
        return error.error.error;
      }
    }
    return error.message || 'Something went wrong';
  }

  // Log errors to console or external service
  logError(error: any): void {
    console.error('Error occurred:', error);
    // In production, you might want to send this to an error logging service
    // like Sentry, LogRocket, etc.
  }
}
