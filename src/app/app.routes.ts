// import { Routes } from '@angular/router';
// import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
// import { BookReaderComponent } from './book-reader/book-reader.component';
// import { CartComponent } from './cart/cart.component';
// import { CheckoutComponent } from './checkout/checkout.component';
// import { HomeComponent } from './home/home.component';
// import { LoginComponent } from './login/login.component';
// import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
// import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
// import { RegisterComponent } from './register/register.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';

// // Import all components


// export const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'home', component: HomeComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
// //   { path: 'books/:id', component: BookDetailComponent },
//   { path: 'cart', component: CartComponent },
//   { path: 'checkout', component: CheckoutComponent
//     // , canActivate: [authGuard]
//    },
//   { path: 'order-confirmation/:id', component: OrderConfirmationComponent
//     // , canActivate: [authGuard] 
//   },
//   { path: 'profile', component: UserProfileComponent
//     // , canActivate: [authGuard] 
//   },
//   { path: 'read/:id', component: PdfViewerComponent
//     // , canActivate: [authGuard] 
//   },
//   { path: 'admin', component: AdminDashboardComponent
//     // , canActivate: [authGuard, adminGuard] 
//   },



//   {
//     path: 'books/:id/read',component: BookReaderComponent
//     // loadComponent: () => import('./components/book-reader/book-reader.component').then(m => m.BookReaderComponent),
//     // Component will handle auth check and book ownership internally
//   },
//   // Wildcard route for 404 page
//   { path: '**', redirectTo: '' }
// ];



import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'books', redirectTo: 'home', pathMatch: 'full' }, // Redirect to home for now
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'read/:id', component: PdfViewerComponent },
  { path: 'admin', component: AdminDashboardComponent },
  // Wildcard route for 404 page
  { path: '**', redirectTo: '' }
];