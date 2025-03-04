import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-qoute',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './qoute.component.html',
  styleUrl: './qoute.component.scss'
})
export class QuoteComponent implements OnInit {
  allQuotes: any[] = [];
  submittedQuote: any | null = null;
  serviceDetails: { [key: number]: string } = {}; // Store service names by ID

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchQuotes();
  }

  fetchQuotes(): void {
    this.apiService.getQuotes().subscribe({
      next: (quotes: any[]) => {
        this.allQuotes = quotes.filter(q => q.status !== 'Rejected');
        this.submittedQuote = this.allQuotes.length > 0 ? this.allQuotes[0] : null;
        this.fetchServiceDetails();
      },
      error: (error: any) => {
        console.error('Error fetching quotes:', error);
      }
    });
  }
  

  fetchServiceDetails(): void {
    this.apiService.getServices().subscribe({
      next: (services: any[]) => {
        this.serviceDetails = services.reduce((acc: any, service: any) => {
          acc[service.id] = service.name;
          return acc;
        }, {});
      },
      error: (error: any) => {
        console.error('Error fetching services:', error);
      }
    });
  }

  getServiceNames(serviceIds: number[]): string {
    return serviceIds.map(id => this.serviceDetails[id] || `Service ${id}`).join(', ');
  }

  approveQuote(quoteId: number): void {
    this.apiService.updateQuoteStatus(quoteId, 'Approved').subscribe({
      next: () => {
        console.log(`Quote ${quoteId} approved.`);
        
        this.apiService.createOrder(quoteId).subscribe({
          next: () => {
            console.log(`Order created for quote ${quoteId}.`);
            this.fetchQuotes(); // Refresh the quotes list
          },
          error: (error: any) => {
            console.error('Error creating order:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error approving quote:', error);
      }
    });
  }
  
  rejectQuote(quoteId: number): void {
    this.apiService.updateQuoteStatus(quoteId, 'Rejected').subscribe({
      next: () => {
        console.log(`Quote ${quoteId} rejected.`);
        this.fetchQuotes(); // Refresh the quotes list
      },
      error: (error: any) => {
        console.error('Error rejecting quote:', error);
      }
    });
  }
  
  pendingQuote(quoteId: number): void {
    this.updateQuoteLocally(quoteId, 'Pending');
    this.apiService.updateQuoteStatus(quoteId, 'Pending').subscribe({
      next: () => {},
      error: (error: any) => {
        console.error('Error setting quote to pending:', error);
      }
    });
  }

  private updateQuoteLocally(quoteId: number, status: string): void {
    const quoteIndex = this.allQuotes.findIndex(q => q.id === quoteId);
    if (quoteIndex !== -1) {
      this.allQuotes[quoteIndex].status = status;
    }

    if (this.submittedQuote && this.submittedQuote.id === quoteId) {
      this.submittedQuote.status = status;
    }
  }

  viewOrders(): void {
    this.router.navigate(['/order']);
  }
}
