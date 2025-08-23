import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  cartTotal: number = 0;
  isLoading: boolean = true;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();
    this.isLoading = false;
  }

  calculateTotal(): void {
    this.cartTotal = this.cartService.getCartTotal();
  }

  updateQuantity(bookId: number, quantity: number,): void {
    if (quantity < 1) {
      quantity = 1;
    }
    this.cartService.updateQuantity(bookId, quantity);
    this.loadCart();
  }

  removeItem(bookId: number): void {
    this.cartService.removeFromCart(bookId);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  proceedToCheckout(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' },
      });
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
