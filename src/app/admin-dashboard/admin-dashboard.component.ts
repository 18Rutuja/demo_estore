import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price?: number;
  category?: { id: number; name: string; description: string };
  isbn: string;
  publicationDate: string;
  language: string;
  pageCount: number;
  fileUrl: string;
  coverImageUrl: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  date: string;
  status: string;
  total: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'books';
  books: Book[] = [];
  categories: Category[] = [];
  users: User[] = [];
  orders: Order[] = [];
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  bookForm: FormGroup;
  categoryForm: FormGroup;
  selectedBook: Book | null = null;
  selectedCategory: Category | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.bookForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', [Validators.required]],
      isbn: ['', [Validators.required]],
      publicationDate: ['', [Validators.required]],
      language: ['', [Validators.required]],
      pageCount: ['', [Validators.required, Validators.min(1)]],
      fileUrl: ['', [Validators.required]],
      coverImageUrl: ['', [Validators.required]]
    });
    
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load mock data since backend services are not available
    setTimeout(() => {
      this.loadMockData();
      this.isLoading = false;
    }, 1000);
  }

  private loadMockData(): void {
    // Mock categories
    this.categories = [
      { id: 1, name: 'Fiction', description: 'Fictional books and novels' },
      { id: 2, name: 'Non-Fiction', description: 'Educational and factual books' },
      { id: 3, name: 'Science', description: 'Scientific and technical books' },
      { id: 4, name: 'Technology', description: 'Programming and technology books' },
      { id: 5, name: 'Business', description: 'Business and entrepreneurship books' }
    ];

    // Mock books
    this.books = [
      {
        id: 1,
        title: 'The Great Adventure',
        author: 'John Smith',
        description: 'An exciting adventure story',
        price: 19.99,
        category: this.categories[0],
        isbn: '978-0123456789',
        publicationDate: '2023-01-15',
        language: 'English',
        pageCount: 320,
        fileUrl: 'https://example.com/book1.pdf',
        coverImageUrl: 'https://via.placeholder.com/300x450?text=Adventure'
      },
      {
        id: 2,
        title: 'Learning JavaScript',
        author: 'Jane Developer',
        description: 'Complete guide to JavaScript programming',
        price: 29.99,
        category: this.categories[3],
        isbn: '978-0987654321',
        publicationDate: '2023-03-20',
        language: 'English',
        pageCount: 450,
        fileUrl: 'https://example.com/book2.pdf',
        coverImageUrl: 'https://via.placeholder.com/300x450?text=JavaScript'
      },
      {
        id: 3,
        title: 'Business Strategy',
        author: 'Mike Business',
        description: 'Modern business strategies for success',
        price: 24.99,
        category: this.categories[4],
        isbn: '978-0456789123',
        publicationDate: '2023-02-10',
        language: 'English',
        pageCount: 280,
        fileUrl: 'https://example.com/book3.pdf',
        coverImageUrl: 'https://via.placeholder.com/300x450?text=Business'
      }
    ];

    // Mock users
    this.users = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'USER' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'USER' },
      { id: 3, firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'ADMIN' },
      { id: 4, firstName: 'Bob', lastName: 'Wilson', email: 'bob@example.com', role: 'USER' }
    ];
    
    // Mock orders
    this.orders = [
      { id: 1, orderNumber: 'ORD-001', customerName: 'John Doe', date: '2025-05-15', status: 'COMPLETED', total: 29.97 },
      { id: 2, orderNumber: 'ORD-002', customerName: 'Jane Smith', date: '2025-05-18', status: 'PROCESSING', total: 14.99 },
      { id: 3, orderNumber: 'ORD-003', customerName: 'Robert Brown', date: '2025-05-19', status: 'COMPLETED', total: 24.98 },
      { id: 4, orderNumber: 'ORD-004', customerName: 'Alice Johnson', date: '2025-05-20', status: 'PENDING', total: 19.99 }
    ];
  }

  setActiveTab(tab: string): void {
    console.log('Setting active tab to:', tab);
    this.activeTab = tab;
    // Clear selections when switching tabs
    this.clearBookSelection();
    this.clearCategorySelection();
  }

  // Book management methods
  selectBook(book: Book): void {
    console.log('Selecting book:', book);
    this.selectedBook = book;
    this.bookForm.patchValue({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      categoryId: book.category?.id,
      isbn: book.isbn,
      publicationDate: book.publicationDate,
      language: book.language,
      pageCount: book.pageCount,
      fileUrl: book.fileUrl,
      coverImageUrl: book.coverImageUrl
    });
  }
  
  clearBookSelection(): void {
    console.log('Clearing book selection');
    this.selectedBook = null;
    this.bookForm.reset();
  }
  
  saveBook(): void {
    console.log('Saving book, form valid:', this.bookForm.valid);
    
    if (this.bookForm.invalid) {
      console.log('Form is invalid:', this.bookForm.errors);
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookForm.controls).forEach(key => {
        this.bookForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    const bookData = this.bookForm.value;
    
    // Find the selected category
    const selectedCategory = this.categories.find(cat => cat.id == bookData.categoryId);
    
    if (this.selectedBook) {
      // Update existing book
      console.log('Updating book:', this.selectedBook.id, bookData);
      
      // Simulate API call
      setTimeout(() => {
        const bookIndex = this.books.findIndex(b => b.id === this.selectedBook!.id);
        if (bookIndex !== -1) {
          this.books[bookIndex] = {
            ...this.selectedBook!,
            ...bookData,
            category: selectedCategory || this.selectedBook!.category
          };
        }
        
        this.isSubmitting = false;
        this.clearBookSelection();
        alert('Book updated successfully!');
      }, 1000);
    } else {
      // Create new book
      console.log('Creating new book:', bookData);
      
      // Simulate API call
      setTimeout(() => {
        const newBook: Book = {
          id: Math.max(...this.books.map(b => b.id)) + 1,
          ...bookData,
          category: selectedCategory || this.categories[0]
        };
        
        this.books.push(newBook);
        this.isSubmitting = false;
        this.clearBookSelection();
        alert('Book created successfully!');
      }, 1000);
    }
  }
  
  deleteBook(bookId: number): void {
    console.log('Deleting book:', bookId);
    
    if (confirm('Are you sure you want to delete this book?')) {
      // Simulate API call
      setTimeout(() => {
        this.books = this.books.filter(book => book.id !== bookId);
        
        if (this.selectedBook && this.selectedBook.id === bookId) {
          this.clearBookSelection();
        }
        
        alert('Book deleted successfully!');
      }, 500);
    }
  }
  
  // Category management methods
  selectCategory(category: Category): void {
    console.log('Selecting category:', category);
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description
    });
  }
  
  clearCategorySelection(): void {
    console.log('Clearing category selection');
    this.selectedCategory = null;
    this.categoryForm.reset();
  }
  
  saveCategory(): void {
    console.log('Saving category, form valid:', this.categoryForm.valid);
    
    if (this.categoryForm.invalid) {
      console.log('Category form is invalid:', this.categoryForm.errors);
      // Mark all fields as touched to show validation errors
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    const categoryData = this.categoryForm.value;
    
    if (this.selectedCategory) {
      // Update existing category
      console.log('Updating category:', this.selectedCategory.id, categoryData);
      
      // Simulate API call
      setTimeout(() => {
        const categoryIndex = this.categories.findIndex(c => c.id === this.selectedCategory!.id);
        if (categoryIndex !== -1) {
          this.categories[categoryIndex] = {
            ...this.selectedCategory!,
            ...categoryData
          };
        }
        
        this.isSubmitting = false;
        this.clearCategorySelection();
        alert('Category updated successfully!');
      }, 1000);
    } else {
      // Create new category
      console.log('Creating new category:', categoryData);
      
      // Simulate API call
      setTimeout(() => {
        const newCategory: Category = {
          id: Math.max(...this.categories.map(c => c.id)) + 1,
          ...categoryData
        };
        
        this.categories.push(newCategory);
        this.isSubmitting = false;
        this.clearCategorySelection();
        alert('Category created successfully!');
      }, 1000);
    }
  }
  
  deleteCategory(categoryId: number): void {
    console.log('Deleting category:', categoryId);
    
    if (confirm('Are you sure you want to delete this category?')) {
      // Check if any books use this category
      const booksUsingCategory = this.books.filter(book => book.category?.id === categoryId);
      
      if (booksUsingCategory.length > 0) {
        alert(`Cannot delete category. ${booksUsingCategory.length} book(s) are using this category.`);
        return;
      }
      
      // Simulate API call
      setTimeout(() => {
        this.categories = this.categories.filter(category => category.id !== categoryId);
        
        if (this.selectedCategory && this.selectedCategory.id === categoryId) {
          this.clearCategorySelection();
        }
        
        alert('Category deleted successfully!');
      }, 500);
    }
  }

  // User management methods
  viewUser(user: User): void {
    console.log('Viewing user:', user);
    alert(`User Details:\nName: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nRole: ${user.role}`);
  }

  editUser(user: User): void {
    console.log('Editing user:', user);
    alert('Edit user functionality would open a modal or navigate to edit page');
  }

  deleteUser(userId: number): void {
    console.log('Deleting user:', userId);
    
    if (confirm('Are you sure you want to delete this user?')) {
      setTimeout(() => {
        this.users = this.users.filter(user => user.id !== userId);
        alert('User deleted successfully!');
      }, 500);
    }
  }

  // Order management methods
  viewOrder(order: Order): void {
    console.log('Viewing order:', order);
    alert(`Order Details:\nOrder #: ${order.orderNumber}\nCustomer: ${order.customerName}\nDate: ${order.date}\nStatus: ${order.status}\nTotal: $${order.total.toFixed(2)}`);
  }

  updateOrder(order: Order): void {
    console.log('Updating order:', order);
    const newStatus = prompt('Enter new status (PENDING, PROCESSING, COMPLETED, CANCELLED):', order.status);
    
    if (newStatus && ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].includes(newStatus.toUpperCase())) {
      const orderIndex = this.orders.findIndex(o => o.id === order.id);
      if (orderIndex !== -1) {
        this.orders[orderIndex].status = newStatus.toUpperCase();
        alert('Order status updated successfully!');
      }
    } else if (newStatus) {
      alert('Invalid status. Please use: PENDING, PROCESSING, COMPLETED, or CANCELLED');
    }
  }

  // Reports methods
  viewSalesReport(): void {
    console.log('Viewing sales report');
    alert('Sales report functionality would show detailed sales analytics');
  }

  viewTopBooksReport(): void {
    console.log('Viewing top books report');
    alert('Top books report functionality would show best-selling books');
  }

  viewUserActivityReport(): void {
    console.log('Viewing user activity report');
    alert('User activity report functionality would show user engagement metrics');
  }

  viewCategoryRevenueReport(): void {
    console.log('Viewing category revenue report');
    alert('Category revenue report functionality would show revenue by category');
  }

  // Settings methods
  saveSettings(): void {
    console.log('Saving settings');
    alert('Settings saved successfully!');
  }
}