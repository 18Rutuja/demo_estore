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
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip login & register endpoints so we don't add token or trigger refresh
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register')
  ) {
    return next(req);
  }

  // Attach token if available
  const token = authService.getToken();
  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
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

    return authService.refreshToken().pipe(
      switchMap((newToken: string | null) => {
        isRefreshing = false;
        if (newToken) {
          refreshTokenSubject.next(newToken);
          return next(addToken(request, newToken));
        } else {
          // No refresh token available — force logout
          authService.logout();
          return throwError(() => new Error('No refresh token available'));
        }
      }),
      catchError(err => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    // Wait until token refresh completes, then retry request
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addToken(request, token!)))
    );
  }
}
