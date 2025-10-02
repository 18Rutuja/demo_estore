// import { HttpClient } from '@angular/common/http';
// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
// import { Subscription } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { AuthService } from '../services/auth.service';
// import { BookService } from '../services/book.service';

// @Component({
//   selector: 'app-pdf-viewer',
//   standalone: true,
//   imports: [
//     NgxExtendedPdfViewerModule,
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     RouterModule,
//   ],
//   templateUrl: './pdf-viewer.component.html',
//   styleUrl: './pdf-viewer.component.scss',
// })
// export class PdfViewerComponent implements OnInit, OnDestroy {
//   bookId: number = 0;
//   bookTitle: string = '';
//   pdfSrc: any = null;
//   loading: boolean = true;
//   error: string | null = null;
//   currentPage: number = 1;
//   totalPages: number = 0;
//   zoom: number = 100;
//   private subscriptions: Subscription[] = [];

//   // User info for watermarking
//   userEmail: string = '';
//   readSessionId: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private bookService: BookService,
//     private authService: AuthService,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     // Get book ID from route params
//     this.route.params.subscribe((params) => {
//       this.bookId = +params['id'];
//       this.loadBook();
//     });

//     // Get user info for watermarking
//     const currentUser = this.authService.currentUserValue;
//     if (currentUser) {
//       this.userEmail = currentUser.email;
//     }
//   }

//   ngOnDestroy(): void {
//     // Clean up subscriptions
//     this.subscriptions.forEach((sub) => sub.unsubscribe());

//     // Save reading progress when component is destroyed
//     this.saveReadingProgress();
//   }

//   loadBook(): void {
//     this.loading = true;
//     this.error = null;

//     const sub = this.bookService.getBookForReading(this.bookId).subscribe({
//       next: (response) => {
//         this.bookTitle = response.title;
//         this.readSessionId = response.sessionId;

//         // Load the PDF with the session ID for secure streaming
//         this.pdfSrc = {
//           url: `${environment.apiUrl}/books/${this.bookId}/content?sessionId=${this.readSessionId}`,
//           withCredentials: true,
//           httpHeaders: {
//             Authorization: `Bearer ${this.authService.getToken()}`,
//           },
//         };

//         this.loading = false;

//         // Restore reading progress if available
//         this.restoreReadingProgress();
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error =
//           'Failed to load the book. Please check if you have purchased this book.';
//         console.error('Error loading book:', err);
//       },
//     });

//     this.subscriptions.push(sub);
//   }

//   // Handle page change events
//   onPageChange(pageNumber: number): void {
//     this.currentPage = pageNumber;
//     // Save reading progress periodically
//     if (pageNumber % 5 === 0) {
//       this.saveReadingProgress();
//     }
//   }

//   // Save reading progress to server
//   saveReadingProgress(): void {
//     if (this.bookId && this.currentPage > 0) {
//       const progressData = {
//         bookId: this.bookId,
//         currentPage: this.currentPage,
//         totalPages: this.totalPages,
//       };

//       this.http
//         .post(`${environment.apiUrl}/users/reading-progress`, progressData)
//         .subscribe({
//           error: (err) => console.error('Error saving reading progress:', err),
//         });
//     }
//   }

//   // Restore reading progress from server
//   restoreReadingProgress(): void {
//     this.http
//       .get(`${environment.apiUrl}/users/reading-progress/${this.bookId}`)
//       .subscribe({
//         next: (response: any) => {
//           if (response && response.currentPage) {
//             this.currentPage = response.currentPage;
//           }
//         },
//         error: (err) => console.error('Error restoring reading progress:', err),
//       });
//   }

//   // Handle PDF loaded event
//   onPdfLoaded(pdf: any): void {
//     this.totalPages = pdf.numPages;
//   }

//   // Prevent right-click to disable downloading
//   onContextMenu(event: MouseEvent): boolean {
//     event.preventDefault();
//     return false;
//   }

//   // Handle zoom changes
//   zoomIn(): void {
//     this.zoom = Math.min(this.zoom + 25, 300);
//   }

//   zoomOut(): void {
//     this.zoom = Math.max(this.zoom - 25, 50);
//   }

//   // Navigate back to library
//   goToLibrary(): void {
//     this.router.navigate(['/profile/library']);
//   }
// }


import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [
    NgxExtendedPdfViewerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'], // ✅ FIXED (was styleUrl)
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  bookId = 0;
  bookTitle = '';
  pdfSrc: any = null;
  loading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 0;
  zoom = 100;
  private subscriptions: Subscription[] = [];

  userEmail = '';
  readSessionId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookId = +params['id'];
      this.loadBook();
    });

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userEmail = currentUser.email;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.saveReadingProgress();
  }

  loadBook(): void {
    this.loading = true;
    this.error = null;

    const sub = this.bookService.getBookForReading(this.bookId).subscribe({
      next: (response) => {
        this.bookTitle = response.title;
        this.readSessionId = response.sessionId;

        this.pdfSrc = {
          url: `${environment.apiUrl}/books/${this.bookId}/content?sessionId=${this.readSessionId}`,
          withCredentials: true,
          httpHeaders: {
            Authorization: `Bearer ${this.authService.getToken()}`,
          },
        };

        this.loading = false;
        this.restoreReadingProgress();
      },
      error: (err) => {
        this.loading = false;
        this.error =
          'Failed to load the book. Please check if you have purchased this book.';
        console.error('Error loading book:', err);
      },
    });

    this.subscriptions.push(sub);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    if (pageNumber % 5 === 0) {
      this.saveReadingProgress();
    }
  }

  saveReadingProgress(): void {
    if (this.bookId && this.currentPage > 0) {
      const progressData = {
        bookId: this.bookId,
        currentPage: this.currentPage,
        totalPages: this.totalPages,
      };

      this.http
        .post(`${environment.apiUrl}/users/reading-progress`, progressData)
        .subscribe({
          error: (err) => console.error('Error saving reading progress:', err),
        });
    }
  }

  restoreReadingProgress(): void {
    this.http
      .get(`${environment.apiUrl}/users/reading-progress/${this.bookId}`)
      .subscribe({
        next: (response: any) => {
          if (response?.currentPage) {
            this.currentPage = response.currentPage;
          }
        },
        error: (err) => console.error('Error restoring reading progress:', err),
      });
  }

  onPdfLoaded(pdf: any): void {
    this.totalPages = pdf.numPages;
  }

  onContextMenu(event: MouseEvent): boolean {
    event.preventDefault();
    return false;
  }

  zoomIn(): void {
    this.zoom = Math.min(this.zoom + 25, 300);
  }

  zoomOut(): void {
    this.zoom = Math.max(this.zoom - 25, 50);
  }

  goToLibrary(): void {
    this.router.navigate(['/profile/library']);
  }
}

