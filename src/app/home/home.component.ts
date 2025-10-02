import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { Category } from '../models/category.model';
import { BookService } from '../services/book.service';
import { CategoryService } from '../services/category.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredBooks: Book[] = [];
  newReleases: Book[] = [];
  bestsellers: Book[] = [];
  categories: Category[] = [];
  isLoading = true;
  error: string | null = null;
  searchQuery: string = '';

  private dataSubscription: Subscription | null = null;

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHomePageData();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadHomePageData(): void {
    this.isLoading = true;
    this.error = null;

    if (this.shouldUseMockData()) {
      this.createAndUseMockData();
      return;
    }

    const featured$ = this.bookService.getFeaturedBooks().pipe(
      catchError(err => { 
        console.error('Error loading featured books:', err); 
        this.error = 'Failed to load featured books.'; 
        return of([]); 
      })
    );

    const newReleases$ = this.bookService.getNewReleases().pipe(
      catchError(err => { 
        console.error('Error loading new releases:', err); 
        this.error = (this.error ? this.error + ' ' : '') + 'Failed to load new releases.'; 
        return of([]); 
      })
    );

    const bestsellers$ = this.bookService.getBestsellerBooks().pipe(
      catchError(err => { 
        console.error('Error loading bestsellers:', err); 
        this.error = (this.error ? this.error + ' ' : '') + 'Failed to load bestsellers.'; 
        return of([]); 
      })
    );

    this.dataSubscription = forkJoin({
      featured: featured$,
      newReleases: newReleases$,
      bestsellers: bestsellers$
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        if (!this.featuredBooks.length && !this.newReleases.length && !this.bestsellers.length) {
          this.createAndUseMockData();
        }
      })
    ).subscribe({
      next: (results) => {
        this.featuredBooks = results.featured;
        this.newReleases = results.newReleases;
        this.bestsellers = results.bestsellers;
      },
      error: (err) => {
        console.error('Unexpected error loading home page data:', err);
        this.error = 'An unexpected error occurred loading page data.';
        this.createAndUseMockData();
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      catchError(err => {
        console.error('Error loading categories:', err);
        return of(this.getMockCategories());
      })
    ).subscribe((categories: Category[]) => {
      this.categories = categories.length ? categories : this.getMockCategories();
    });
  }

  shouldUseMockData(): boolean {
    return typeof window !== 'undefined' && !window.navigator.onLine;
  }

  createAndUseMockData(): void {
    this.isLoading = false;
    this.featuredBooks = this.getMockBooks('featured');
    this.newReleases = this.getMockBooks('new');
    this.bestsellers = this.getMockBooks('bestseller');
  }

  getMockBooks(type: string): Book[] {
    const baseBooks: Partial<Book>[] = [
      { id: 1, title: 'The Art of Programming', author: 'Jane Developer', description: 'A comprehensive guide to modern programming techniques.', price: 29.99, coverImageUrl: 'https://via.placeholder.com/300x450?text=Programming' },
      { id: 2, title: 'Data Science Fundamentals', author: 'John Analyst', description: 'Learn the core concepts of data science and analytics.', price: 34.99, coverImageUrl: 'https://via.placeholder.com/300x450?text=Data+Science' },
      { id: 3, title: 'Cloud Architecture Patterns', author: 'Sarah Cloud', description: 'Design scalable and resilient applications for the cloud.', price: 39.99, coverImageUrl: 'https://via.placeholder.com/300x450?text=Cloud+Architecture' },
      { id: 4, title: 'Mobile App Development', author: 'Mike Mobile', description: 'Create stunning mobile applications for iOS and Android.', price: 27.99, coverImageUrl: 'https://via.placeholder.com/300x450?text=Mobile+Dev' },
      { id: 5, title: 'Machine Learning in Practice', author: 'Lisa Learning', description: 'Practical applications of machine learning algorithms.', price: 42.99, coverImageUrl: 'https://via.placeholder.com/300x450?text=Machine+Learning' }
    ];

    return baseBooks.map((book, index) => {
      const fullBook = book as Book;
      fullBook.featured = type === 'featured';
      fullBook.newRelease = type === 'new';
      fullBook.bestseller = type === 'bestseller';
      fullBook.id = fullBook.id! + (index * 10);
      return fullBook;
    });
  }

  getMockCategories(): Category[] {
    return [
      { id: 1, name: 'Programming' },
      { id: 2, name: 'Data Science' },
      { id: 3, name: 'Web Development' },
      { id: 4, name: 'Cloud Computing' },
      { id: 5, name: 'Mobile Development' },
      { id: 6, name: 'DevOps' },
      { id: 7, name: 'Artificial Intelligence' },
      { id: 8, name: 'Cybersecurity' }
    ];
  }

  navigateToBookDetails(bookId: number, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.router.navigate(['/books', bookId]);
  }

  addBookToCart(book: Book, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.cartService.addToCart(book);
    
    // Enhanced feedback with toast notification instead of alert
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="toast-content">
        <p class="toast-title">${book.title}</p>
        <p class="toast-message">Added to your cart</p>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Animate and remove toast after delay
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }, 100);
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/category', categoryId]);
  }

  searchBooks(query: string): void {
    if (query && query.trim().length > 0) {
      this.router.navigate(['/search'], { queryParams: { q: query.trim() } });
    }
  }
}

