import { Component, OnInit } from '@angular/core';
import { NgFor,NgIf } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-qoute',
  imports: [NgFor,NgIf],
  templateUrl: './qoute.component.html',
  styleUrl: './qoute.component.scss'
})
export class QuoteComponent implements OnInit {
  allQuotes: any[] = [];
  submittedQuote: any | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchQuotes();
  }

  fetchQuotes(): void {
    this.apiService.getQuotes().subscribe({
      next: (quotes) => {
        this.allQuotes = quotes;
        if (quotes.length > 0) {
          this.submittedQuote = quotes[0]; // Show the first quote by default
        }
      },
      error: (error) => {
        console.error('Error fetching quotes:', error);
      }
    });
  }

  approveQuote(quoteId: string): void {
    this.apiService.approveQuote(quoteId).subscribe({
      next: () => {
        this.fetchQuotes(); // Refresh quotes
      },
      error: (error) => {
        console.error('Error approving quote:', error);
      }
    });
  }

  rejectQuote(quoteId: string): void {
    console.log(`Rejected quote: ${quoteId}`);
  }

  pendingQuote(quoteId: string): void {
    console.log(`Pending quote: ${quoteId}`);
  }
}
