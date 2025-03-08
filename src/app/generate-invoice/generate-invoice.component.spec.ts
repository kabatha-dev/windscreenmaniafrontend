import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateInvoiceComponent } from './generate-invoice.component';
import { InvoiceService } from '../services/invoice.service';
import { of } from 'rxjs';

describe('GenerateInvoiceComponent', () => {
  let component: GenerateInvoiceComponent;
  let fixture: ComponentFixture<GenerateInvoiceComponent>;
  let mockInvoiceService: jasmine.SpyObj<InvoiceService>;

  beforeEach(async () => {
    // Create a mock for InvoiceService
    mockInvoiceService = jasmine.createSpyObj('InvoiceService', ['getInvoices']);

    // Mock the return value of getInvoices
    mockInvoiceService.getInvoices.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [GenerateInvoiceComponent],
      providers: [{ provide: InvoiceService, useValue: mockInvoiceService }]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch invoices on init', () => {
    expect(mockInvoiceService.getInvoices).toHaveBeenCalled();
  });
});
