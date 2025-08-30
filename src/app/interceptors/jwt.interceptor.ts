// src/app/interceptors/jwt.interceptor.ts
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';
import { AuthService } from '../services/auth.service';

// Track refresh state to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null );

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip login & register endpoints so we don't add token or trigger refresh
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register')
  ) {
    console.log('Skipping JWT interceptor for auth endpoint:', req.url);
    return next(req);
  }

  // Attach token if available
  const token = authService.getToken();
  if (token) {
    console.log('Adding token to request:', req.url);
    req = addToken(req, token);
  } else {
    console.log('No token available for request:', req.url);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.log('401 error detected, attempting token refresh for:', req.url);
        // Handle unauthorized error via refresh token
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    console.log('Starting token refresh process...');
    console.log('Current user:', authService.currentUserValue);

    return authService.refreshToken().pipe(
      switchMap((newToken: string | null) => {
        isRefreshing = false;
        if (newToken) {
          console.log('Token refresh successful, retrying original request');
          refreshTokenSubject.next(newToken);
          return next(addToken(request, newToken));
        } else {
          console.log('No refresh token available - forcing logout');
          // No refresh token available — force logout
          authService.logout();
          return throwError(() => new Error('No refresh token available'));
        }
      }),
      catchError(err => {
        console.error('Token refresh failed:', err);
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    console.log('Token refresh already in progress, waiting...');
    // Wait until token refresh completes, then retry request
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        console.log('Using refreshed token for queued request');
        return next(addToken(request, token!));
      })
    );
  }
}
