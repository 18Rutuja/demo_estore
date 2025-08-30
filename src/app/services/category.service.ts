import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', 
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<any> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Get category by ID
  getCategoryById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Admin: Create new category
  createCategory(categoryData: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, categoryData)
      .pipe(catchError(this.handleError));
  }

  // Admin: Update category
  updateCategory(id: number, categoryData: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, categoryData)
      .pipe(catchError(this.handleError));
  }

  // Admin: Delete category
  deleteCategory(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
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
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCategoryByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/name/${name}`);
  }
}
