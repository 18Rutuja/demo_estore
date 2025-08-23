import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payment.service';

declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardElement') cardElement!: ElementRef;

  stripe: any;
  card: any;
  cardErrors: string | undefined;
  loading = false;
  
  paymentMethods: any[] = [];
  selectedPaymentMethod: string = 'new';

  checkoutForm: FormGroup;
  cartItems: any[] = [];
  cartTotal: number = 0;
  errorMessage: string = '';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      saveCard: [false]
    });
  }

  ngOnInit(): void {
    // Redirect if not logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    
    // Redirect if cart is empty
    if (this.cartService.getItemCount() === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    
    // Load cart items
    this.loadCart();
    
    // Pre-fill form with user data if available
    this.loadUserData();
    
    // Get saved payment methods if user is logged in
    if (this.authService.isLoggedIn()) {
      this.loadPaymentMethods();
    }
  }

  ngAfterViewInit(): void {
    // Make sure Stripe is available
    if (typeof Stripe !== 'undefined') {
      // Initialize Stripe elements
      // this.stripe = Stripe(environment.stripePublicKey);
      const elements = this.stripe.elements();
      
      this.card = elements.create('card');
      this.card.mount(this.cardElement.nativeElement);
      
      this.card.addEventListener('change', (event: any) => {
        this.cardErrors = event.error ? event.error.message : '';
      });
    } else {
      console.error('Stripe.js is not loaded');
      this.errorMessage = 'Payment system is currently unavailable. Please try again later.';
    }
  }

  ngOnDestroy(): void {
    if (this.card) {
      this.card.destroy();
    }
  }

  loadCart(): void {
    // Get cart items from service
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();
    
    // Also subscribe to cart changes
    this.cartService.cartItems.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  loadUserData(): void {
    const user = this.authService.getUser();
    if (user) {
      this.checkoutForm.patchValue({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || ''
      });
    }
  }

  calculateTotal(): void {
    this.cartTotal = this.cartService.getCartTotal();
    
    // Also subscribe to cart total changes
    this.cartService.cartTotal.subscribe(total => {
      this.cartTotal = total;
    });
  }

  // Load saved payment methods
  loadPaymentMethods(): void {
    this.paymentService.getUserPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
      }
    });
  }

  // Handle payment method selection
  onPaymentMethodChange(event: any): void {
    this.selectedPaymentMethod = event.target.value;
  }

  // Submit order
  async onSubmit(): Promise<void> {
    if (this.checkoutForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    try {
      // Create payment intent
      const paymentIntentResponse = await this.paymentService.createPaymentIntent(
        this.cartTotal * 100 // Convert to cents
      ).toPromise();
      
      if (!paymentIntentResponse) {
        throw new Error('Failed to create payment intent');
      }
      
      let paymentResult;
      
      if (this.selectedPaymentMethod === 'new') {
        // Process payment with new card
        paymentResult = await this.paymentService.processCardPayment(
          paymentIntentResponse.clientSecret,
          this.card
        );
        
        // Save card if requested
        if (this.checkoutForm.value.saveCard && paymentResult.payment_method) {
          this.paymentService.savePaymentMethod(paymentResult.payment_method).subscribe();
        }
      } else {
        // Process payment with saved payment method
        // This would need to be implemented based on your backend
        throw new Error('Saved payment methods not yet implemented');
      }
      
      // Create order
      const orderData = {
        paymentIntentId: paymentIntentResponse.id,
        items: this.cartItems.map(item => ({
          bookId: item.book ? item.book.id : item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: this.cartTotal,
        customerInfo: {
          name: this.checkoutForm.value.name,
          email: this.checkoutForm.value.email
        }
      };
      
      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          // Clear cart
          this.cartService.clearCart();
          
          // Navigate to order confirmation
          this.router.navigate(['/order-confirmation', order.id]);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.loading = false;
          this.errorMessage = error.message || 'Failed to create order. Please try again.';
        }
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      this.cardErrors = error.message;
      this.errorMessage = error.message || 'Payment processing failed. Please try again.';
      this.loading = false;
    }
  }
}
