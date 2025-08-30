import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartKey = 'shopping_cart';

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  public cartItems = this.cartItemsSubject.asObservable();

  private cartTotalSubject = new BehaviorSubject<number>(0);
  public cartTotal = this.cartTotalSubject.asObservable();

  constructor(private http: HttpClient) {
    // Safely load cart data on initialization
    this.loadCart();
  }


  // Safely check if localStorage is available
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      if (typeof window === 'undefined') {
        return false;
      }
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

    
  // Load cart data from localStorage if available
  private loadCart(): void {
    if (this.isLocalStorageAvailable()) {
      const cart = localStorage.getItem(this.cartKey);
      const cartItems = cart ? JSON.parse(cart) : [];
      this.cartItemsSubject.next(cartItems);
      this.updateCartTotal(cartItems);
    }
  }

  // Update cart total
  private updateCartTotal(cartItems: any[]): void {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cartTotalSubject.next(total);
  }
  // Local cart management
  getCart(): any[] {
    return this.cartItemsSubject.value;
  }

  getCartTotal(): number {
    return this.cartTotalSubject.value;
  }
  getItemCount(): number {
    return this.getCart().reduce((count, item) => count + item.quantity, 0);
  }

  // API calls for checkout

  checkout(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }

  getOrderHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`);
  }

  // Load cart from local storage or server
  // private loadCart(): void {
  //   // For logged in users, get cart from server
  //   if (localStorage.getItem('currentUser')) {
  //     this.getCartFromServer().subscribe({
  //       next: (response) => {
  //         this.cartItemsSubject.next(response.items);
  //         this.calculateTotal(response.items);
  //       },
  //       error: (error) => {
  //         console.error('Error loading cart from server:', error);
  //         // Fallback to local storage
  //         this.loadCartFromLocalStorage();
  //       },
  //     });
  //   } else {
  //     // For anonymous users, get cart from local storage
  //     this.loadCartFromLocalStorage();
  //   }
  // }

  // Load cart from local storage
  private loadCartFromLocalStorage(): void {
    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
      const cart = JSON.parse(cartJson);
      this.cartItemsSubject.next(cart);
      this.calculateTotal(cart);
    }
  }

  // Save cart to local storage
  private saveCartToLocalStorage(items: any[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  // Calculate cart total
  private calculateTotal(items: any[]): void {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.cartTotalSubject.next(total);
  }

  // Get cart from server
  getCartFromServer(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  }

  addToCart(book: any): void {
    const currentCart = this.getCart();
    const existingItem = currentCart.find(item => item.book?.id === book.id);
    
    let updatedCart: any[];
    
    if (existingItem) {
      existingItem.quantity += 1;
      updatedCart = [...currentCart];
	
    } else {
      updatedCart = [...currentCart, {
        book: book,
        quantity: 1,
        price: book.price
      }];
    }
    
    this.cartItemsSubject.next(updatedCart);
    this.updateCartTotal(updatedCart);
    
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
    }
  }

  updateQuantity(bookId: number, quantity: number): void {
    const currentCart = this.getCart();
    const updatedCart = currentCart.map(item => {
      if (item.book?.id === bookId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    this.cartItemsSubject.next(updatedCart);
    this.updateCartTotal(updatedCart);
    
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));

    }
  }

  // Remove item from cart
  removeFromCart(bookId: number): void {
    const currentCart = this.getCart();
    const updatedCart = currentCart.filter(item => item.book?.id !== bookId);
    this.cartItemsSubject.next(updatedCart);
    this.updateCartTotal(updatedCart);   
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
    }
  }

  // Clear cart
  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.cartTotalSubject.next(0);
    
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.cartKey);
    }
  }

  // Merge anonymous cart with user cart after login
  mergeCart(): Observable<any> {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (localCart.length === 0) {
      return this.getCartFromServer();
    }

    return this.http
      .post<any>(`${this.apiUrl}/merge`, { items: localCart })
      .pipe(
        tap((response) => {
          this.cartItemsSubject.next(response.items);
          this.calculateTotal(response.items);
          localStorage.removeItem('cart');
        }),
        catchError(this.handleError)
      );
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
