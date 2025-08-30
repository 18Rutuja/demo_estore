// src/app/services/auth.service.ts
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
} )
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private refreshTokenTimeout: any;
  private isLocalStorageAvailable: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID ) private platformId: Object
  ) {
    this.isLocalStorageAvailable = this.checkLocalStorage();
    this.currentUserSubject = new BehaviorSubject<any>(null);

    if (isPlatformBrowser(this.platformId)) {
      const userFromStorage = this.getUserFromStorage();
      this.currentUserSubject.next(userFromStorage);
    }

    this.currentUser = this.currentUserSubject.asObservable();
  }

  // ===== LocalStorage Handling =====
  private checkLocalStorage(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const testKey = '__test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private getUserFromStorage(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('currentUser');
      if (!userJson) {
        return null;
      }
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        localStorage.removeItem('currentUser'); // Clear corrupted data
        return null;
      }
    }
    return null;
  }

  saveToken(token: string): void {
    if (this.isLocalStorageAvailable) {
      localStorage.setItem('token', token);
    }
  }

  saveUser(user: any): void {
    if (this.isLocalStorageAvailable) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  getToken(): string | null {
    if (!this.isLocalStorageAvailable) return null;
    return localStorage.getItem('token');
  }

  clearToken(): void {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem('token');
    }
  }

  getUser(): any {
    if (!this.isLocalStorageAvailable) return null;
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      return null;
    }
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user data from localStorage on getUser()', e);
      localStorage.removeItem('currentUser'); // Clear corrupted data
      return null;
    }
  }

  // ===== Auth Methods =====
  login(email: string, password: string): Observable<any> {
    if (environment.mockApi) {
      console.log('Using mock login API');
      if (email === 'test@example.com' && password === 'password123') {
        const mockResponse = {
          accessToken: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 1,
            email,
            firstName: 'Test',
            lastName: 'User',
            roles: ['ROLE_ADMIN'],
          },
        };
        this.saveToken(mockResponse.accessToken);
        this.saveUser({ ...mockResponse.user, refreshToken: mockResponse.refreshToken });
        return of(mockResponse);
      } else {
        return throwError(() => ({ error: { message: 'Invalid email or password' } }));
      }
    }

    return this.http.post<any>(`${this.apiUrl}/login`, { email, password } ).pipe(
      tap((response) => {
        if (response?.accessToken) {
          this.saveToken(response.accessToken);
          // Backend now returns 'user' object directly in response
          this.saveUser(response.user);
          // this.startRefreshTokenTimer(); // No refresh token in current backend
        }
      }),
      catchError((error) => throwError(() => error))
    );
  }

  logout(): void {
    if (this.isLocalStorageAvailable) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.stopRefreshTokenTimer();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(userData: any): Observable<any> {
    if (environment.mockApi) {
      console.log('Using mock register API');
      if (userData.email === 'test@example.com') {
        return throwError(() => ({ error: { message: 'Email is already in use!' } }));
      }
      return of({
        id: 2,
        ...userData,
        role: 'USER',
        createdAt: new Date().toISOString(),
      });
    }

    return this.http.post<any>(`${this.apiUrl}/register`, userData ).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  // No refresh token in current backend implementation
  refreshToken(): Observable<any> {
    const currentUser = this.currentUserValue;
    if (!currentUser?.refreshToken) return of(null);

    return this.http
      .post<any>(`${this.apiUrl}/refresh-token`, {
        refreshToken: currentUser.refreshToken,
      } )
      .pipe(
        map((response) => {
          const user = {
            ...currentUser,
            token: response.token,
            refreshToken: response.refreshToken,
          };
          this.saveToken(response.token);
          this.saveUser(user);
          this.currentUserSubject.next(user);
          this.startRefreshTokenTimer();
          return response.token;
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  // Get current user profile from backend
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/profile` ).pipe(
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        return throwError(() => error);
      })
    );
  }

  // ===== Role & Status Checks =====
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserValue;
    return !!(currentUser && currentUser.roles?.some((role: any) => role.name === 'ADMIN'));
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // ===== Refresh Token Timer (not used with current backend) =====
  private startRefreshTokenTimer(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.getToken();
    if (!token) return;

    try {
      const jwtToken = JSON.parse(atob(token.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - 60 * 1000;
      this.refreshTokenTimeout = setTimeout(
        () => this.refreshToken().subscribe(),
        timeout
      );
    } catch (error) {
      console.error('Error parsing JWT token', error);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (isPlatformBrowser(this.platformId)) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
}
