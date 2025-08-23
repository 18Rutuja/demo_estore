import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiErrorHandlingService } from '../services/api-error-handling.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/users`;
  user: any = null;

  editableUser: any = {};
  orders: any[] = [];
  library: any[] = [];
  filteredLibrary: any[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;
  activeTab: string = 'profile';
  librarySearchTerm: string = '';
  
  // Email preferences
  emailPreferences = {
    newsletter: true,
    promotions: true,
    orderUpdates: true
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private errorHandler: ApiErrorHandlingService
  ) {}

  ngOnInit(): void {
    // Redirect if not logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/account' },
      });
      return;
    }

    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;

    // Load user profile
    this.userService.getUserProfile().subscribe({
      next: (data: any) => {
        this.user = data;
        // Create a copy for editing
        this.editableUser = { ...this.user };
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
          this.router.navigate(['/login']);
      },
    });

    // Load order history
    this.userService.getOrderHistory().subscribe({
      next: (data: any[]) => {
        this.orders = data;
      },
      error: (error: any) => {
        console.error('Error loading order history:', error);
      },
    });

    // Load user library
    this.userService.getUserLibrary().subscribe({
      next: (data: any[]) => {
        this.library = data;
        this.filteredLibrary = [...this.library];
      },
      error: (error: any) => {
        console.error('Error loading user library:', error);
      },
    });

    // Load email preferences
    this.http.get<any>(`${this.apiUrl}/email-preferences`).subscribe({
      next: (data: any) => {
        this.emailPreferences = data;
      },
      error: (error: any) => {
        console.error('Error loading email preferences:', error);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    
    // If switching to library tab, reset search
    if (tab === 'library') {
      this.librarySearchTerm = '';
      this.filteredLibrary = [...this.library];
    }
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Cancel edit - reset editable user
      this.editableUser = { ...this.user };
    }
    this.isEditMode = !this.isEditMode;
  }

  saveProfile(): void {
    this.userService.updateUserProfile(this.editableUser).subscribe({
      next: (response: any) => {
        this.user = response;
        this.editableUser = { ...this.user };
        this.isEditMode = false;
        // Show success message
        alert('Profile updated successfully');
      },
      error: (error: any) => {
        console.error('Error updating profile:', error);
        // Show error message
        alert('Failed to update profile. Please try again.');
      }
    });
  }

  searchLibrary(): void {
    if (!this.librarySearchTerm.trim()) {
      this.filteredLibrary = [...this.library];
      return;
    }
    
    const searchTerm = this.librarySearchTerm.toLowerCase().trim();
    this.filteredLibrary = this.library.filter(book => 
      book.title.toLowerCase().includes(searchTerm) || 
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  downloadBook(bookId: number): void {
    // Implement book download logic
    alert(`Downloading book ${bookId}...`);
    // In a real implementation, this would trigger a download from the server
  }

  viewOrderDetails(orderId: number): void {
    // Navigate to order details page or show modal
    alert(`Viewing details for order ${orderId}`);
    // this.router.navigate(['/account/orders', orderId]);
  }

  showChangePasswordModal(): void {
    // In a real implementation, this would show a modal for changing password
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) return;
    
    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;
    
    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    this.userService.changePassword({
      currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        alert('Password changed successfully');
      },
      error: (error) => {
        console.error('Error changing password:', error);
        alert('Failed to change password. Please try again.');
      }
    });
  }

  saveEmailPreferences(): void {
    this.userService.updateEmailPreferences(this.emailPreferences).subscribe({
      next: () => {
        alert('Email preferences updated successfully');
      },
      error: (error) => {
        console.error('Error updating email preferences:', error);
        alert('Failed to update email preferences. Please try again.');
      }
    });
  }

  confirmDeleteAccount(): void {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      this.userService.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/']);
          alert('Your account has been deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again.');
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
