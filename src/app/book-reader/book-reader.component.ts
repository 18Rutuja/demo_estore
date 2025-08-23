import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Subscription, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Book } from '../models/book.model';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-reader',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.scss']
})
export class BookReaderComponent implements OnInit, OnDestroy {
  bookId: number | null = null;
  book: Book | null = null;
  pdfSrc: string | Uint8Array | null = null;
  isLoading = true;
  error: string | null = null;
  
  // PDF viewer options
  zoom = 1.0;
  originalSize = false;
  showAll = true;
  autoresize = true;
  fitToPage = true;
  renderText = true;
  stickToPage = false;
  showBorders = false;
  outline: any[] = [];
  isOutlineShown = false;
  currentPage = 1;
  totalPages = 0;
  
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.bookId = +id;
          this.loadBookDetails();
          this.loadBookContent();
        } else {
          this.error = 'Book ID not provided';
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadBookDetails(): void {
    if (!this.bookId) return;
    
    this.subscriptions.add(
      this.bookService.getBookById(this.bookId).pipe(
        catchError(err => {
          console.error('Error loading book details:', err);
          this.error = 'Failed to load book details. Please try again later.';
          return throwError(() => err);
        })
      ).subscribe(book => {
        this.book = book;
      })
    );
  }

  loadBookContent(): void {
    if (!this.bookId) return;
    
    const apiUrl = `${environment.apiUrl}/books/${this.bookId}/read`;
    
    this.isLoading = true;
    this.error = null;
    
    // Use HTTP client directly to get the PDF as a blob
    this.subscriptions.add(
      this.http.get(apiUrl, { responseType: 'blob' }).pipe(
        catchError(err => {
          console.error('Error loading book content:', err);
          if (err.status === 403) {
            this.error = 'You do not have permission to read this book. Please purchase it first.';
          } else if (err.status === 404) {
            this.error = 'Book content not found.';
          } else {
            this.error = 'Failed to load book content. Please try again later.';
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe(pdfBlob => {
        // Convert blob to data URL
        const reader = new FileReader();
        reader.onload = () => {
          this.pdfSrc = reader.result as string;
        };
        reader.readAsDataURL(pdfBlob);
      })
    );
  }

  // PDF viewer event handlers
  onProgress(progressData: any): void {
    this.isLoading = progressData.loaded < progressData.total;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
 // here it was number
  onPagesLoaded(pagesCount: any): void {
    this.totalPages = pagesCount;
  }

  // here it was any[]
  onOutlineLoaded(outline: any): void {
    this.outline = outline;
  }

  // PDF viewer controls
  zoomIn(): void {
    this.zoom = Math.min(3, this.zoom + 0.1);
  }

  zoomOut(): void {
    this.zoom = Math.max(0.5, this.zoom - 0.1);
  }

  resetZoom(): void {
    this.zoom = 1.0;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  toggleOutline(): void {
    this.isOutlineShown = !this.isOutlineShown;
  }

  goBack(): void {
    this.router.navigate(['/books', this.bookId]);
  }
}
