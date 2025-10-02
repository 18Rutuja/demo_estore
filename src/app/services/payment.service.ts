// src/app/services/payment.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare var Stripe: any;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;
  private stripe: any;

  constructor(private http: HttpClient) {
    // Initialize Stripe with the public key
    this.stripe = Stripe(environment.stripePublicKey);
  }

  // Create payment intent
  // createPaymentIntent(
  //   amount: number,
  //   currency: string = 'usd'
  // ): Observable<any> {
  //   return this.http
  //     .post<any>(`${this.apiUrl}/create-intent`, { amount, currency })
  //     .pipe(catchError(this.handleError));
  // }

  // Process card payment
  // async processCardPayment(
  //   paymentIntentId: string,
  //   cardElement: any
  // ): Promise<any> {
  //   try {
  //     const result = await this.stripe.confirmCardPayment(paymentIntentId, {
  //       payment_method: {
  //         card: cardElement,
  //         billing_details: {
  //           // Billing details can be collected from the user
  //         },
  //       },
  //     });

  //     if (result.error) {
  //       throw new Error(result.error.message);
  //     }

  //     return result.paymentIntent;
  //   } catch (error) {
  //     console.error('Payment processing error:', error);
  //     throw error;
  //   }
  // }

  // Verify payment status
  verifyPayment(paymentIntentId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/verify/${paymentIntentId}`)
      .pipe(catchError(this.handleError));
  }

  // // Get payment methods for user
  // getUserPaymentMethods(): Observable<any> {
  //   return this.http
  //     .get<any>(`${this.apiUrl}/methods`)
  //     .pipe(catchError(this.handleError));
  // }

  // // Save payment method
  // savePaymentMethod(paymentMethodId: string): Observable<any> {
  //   return this.http
  //     .post<any>(`${this.apiUrl}/methods`, { paymentMethodId })
  //     .pipe(catchError(this.handleError));
  // }

  // Delete payment method
  deletePaymentMethod(paymentMethodId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/methods/${paymentMethodId}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
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

  // In payment.service.ts
createPaymentIntent(amount: number ): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/payments/create-intent`, { amount } );
}

async processCardPayment(clientSecret: string, cardElement: any): Promise<any> {
  try {
    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
}

savePaymentMethod(paymentMethodId: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/payments/methods`, { paymentMethodId } );
}

getUserPaymentMethods(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/payments/methods` );
}

}
