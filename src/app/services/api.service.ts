// src/app/services/api.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
} )
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // Match your Spring Boot server URL and context path

  constructor(private http: HttpClient ) { }

  // Example GET request with auth token
  get<T>(endpoint: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers } );
  }

  // Example POST request with auth token
  post<T>(endpoint: string, data: any): Observable<T> {
    const headers = this.getHeaders();
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers } );
  }

  // Add similar methods for PUT, DELETE, etc.

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    return headers;
  }
}
