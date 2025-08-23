// admin-dashboard.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { BookService } from '../services/book.service';
import { CategoryService } from '../services/category.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  // Simple mocks for services
  const bookServiceMock = {
    getBooks: jasmine.createSpy('getBooks').and.returnValue(of([])),
    createBook: jasmine.createSpy('createBook').and.returnValue(of({})),
    updateBook: jasmine.createSpy('updateBook').and.returnValue(of({})),
    deleteBook: jasmine.createSpy('deleteBook').and.returnValue(of({}))
  };

  const categoryServiceMock = {
    getAllCategories: jasmine.createSpy('getAllCategories').and.returnValue(of([])),
    createCategory: jasmine.createSpy('createCategory').and.returnValue(of({})),
    updateCategory: jasmine.createSpy('updateCategory').and.returnValue(of({})),
    deleteCategory: jasmine.createSpy('deleteCategory').and.returnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent, ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: BookService, useValue: bookServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
