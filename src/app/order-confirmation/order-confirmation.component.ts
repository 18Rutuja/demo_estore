import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  order: any;
  
  constructor(private router: Router) {
    // Get order data from router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'];
    }
  }

  ngOnInit(): void {
    // Redirect if no order data
    if (!this.order) {
      this.router.navigate(['/']);
    }
  }

  goToLibrary(): void {
    this.router.navigate(['/my-library']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
