import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlingService {
  constructor() { }
  
  /**
   * Global error handler for API requests
   * @param error The HTTP error response
   * @returns An observable with the error message
   */
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    
    if (error.error && error.error.message) {
      // Server-side error with message
      errorMessage = error.error.message;
    } else if (error.message) {
      // Client-side error or general error
      errorMessage = error.message;
    } else {
      // Server-side error with status codes
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error Code: ${error.status}`;
      }
    }
    
    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
