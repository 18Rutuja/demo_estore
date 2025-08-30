// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, retry } from 'rxjs/operators';
// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class BookService {
//   private apiUrl = `${environment.apiUrl}/books`;

//   constructor(private http: HttpClient) {}

//   // 🔑 Add Authorization header
//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       Authorization: token ? `Bearer ${token}` : '',
//     });
//   }

//   // 📚 Get all books with optional filtering
//   getBooks(params?: any): Observable<any> {
//     let httpParams = new HttpParams();

//     if (params) {
//       if (params.category) httpParams = httpParams.set('category', params.category);
//       if (params.search) httpParams = httpParams.set('search', params.search);
//       if (params.page) httpParams = httpParams.set('page', params.page);
//       if (params.size) httpParams = httpParams.set('size', params.size);
//       if (params.sort) httpParams = httpParams.set('sort', params.sort);
//     }

//     return this.http
//       .get<any>(this.apiUrl, { params: httpParams })
//       .pipe(retry(1), catchError(this.handleError));
//   }

//   // 📘 Get book by ID
//   getBookById(id: number): Observable<any> {
//     return this.http
//       .get<any>(`${this.apiUrl}/${id}`)
//       .pipe(retry(1), catchError(this.handleError));
//   }

//   // ⭐ Featured books
//   getFeaturedBooks(): Observable<any> {
//     return this.http
//       .get<any>(`${this.apiUrl}/featured`)
//       .pipe(retry(1), catchError(this.handleError));
//   }

//   // 🏆 Bestseller books
//   getBestsellerBooks(): Observable<any> {
//     return this.http
//       .get<any>(`${this.apiUrl}/bestsellers`)
//       .pipe(retry(1), catchError(this.handleError));
//   }

//   // 🆕 New releases
//   getNewReleases(): Observable<any> {
//     return this.http
//       .get<any>(`${this.apiUrl}/new-releases`)
//       .pipe(retry(1), catchError(this.handleError));
//   }

//   // 📖 Book for reading (requires authentication)
//   getBookForReading(id: number): Observable<any> {
//     return this.http
//       .get<any>(`${this.apiUrl}/${id}/read`, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

//   // 👨‍💼 Admin: Create new book
//   createBook(book: any): Observable<any> {
//     return this.http
//       .post<any>(this.apiUrl, book, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

//   // 👨‍💼 Admin: Update book
//   updateBook(id: number, book: any): Observable<any> {
//     return this.http
//       .put<any>(`${this.apiUrl}/${id}`, book, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

//   // 👨‍💼 Admin: Delete book
//   deleteBook(id: number): Observable<any> {
//     return this.http
//       .delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
//       .pipe(catchError(this.handleError));
//   }

//   // 🔍 Search books
//   searchBooks(query: string): Observable<any[]> {
//     return this.http
//       .get<any[]>(`${this.apiUrl}/search?query=${query}`)
//       .pipe(catchError(this.handleError));
//   }

//   // 🔄 For backward compatibility
//   getAllBooks(): Observable<any[]> {
//     return this.getBooks();
//   }

//   getBooksByCategory(categoryId: number): Observable<any[]> {
//     return this.http
//       .get<any[]>(`${this.apiUrl}/category/${categoryId}`)
//       .pipe(catchError(this.handleError));
//   }

//   // ❌ Error handling
//   private handleError(error: any) {
//     let errorMessage = '';
//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = `Error: ${error.error.message}`;
//     } else {
//       // Server-side error
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//     }
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient){}

  // 🔑 Add Authorization header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // 📚 Get all books with optional filtering
  getBooks(params?: any): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.page) httpParams = httpParams.set('page', params.page);
      if (params.size) httpParams = httpParams.set('size', params.size);
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
    }

    return this.http
      .get<any>(this.apiUrl, { params: httpParams })
      .pipe(retry(1), catchError(this.handleError));
  }

  // 📘 Get book by ID
  getBookById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // ⭐ Featured books
  getFeaturedBooks(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/featured`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // 🏆 Bestseller books
  getBestsellerBooks(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/bestsellers`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // 🆕 New releases
  getNewReleases(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/new-releases`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // 📖 Book for reading (requires authentication)
  getBookForReading(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}/read`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get user's purchased books
  getUserBooks(): Observable<any[]> {
    return this.http
      .get<any[]>(`${environment.apiUrl}/users/books`, { headers: this.getAuthHeaders() })
      .pipe(retry(1), catchError(this.handleError));
  }

  // 👨‍💼 Admin: Create new book
  createBook(book: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, book, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 👨‍💼 Admin: Update book
  updateBook(id: number, book: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, book, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 👨‍💼 Admin: Delete book
  deleteBook(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // 🔍 Search books
  searchBooks(query: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/search?query=${query}`)
      .pipe(catchError(this.handleError));
  }

  // 🔄 For backward compatibility
  getAllBooks(): Observable<any[]> {
    return this.getBooks();
  }

  getBooksByCategory(categoryId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/category/${categoryId}`)
      .pipe(catchError(this.handleError));
  }

  // ❌ Error handling
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
}