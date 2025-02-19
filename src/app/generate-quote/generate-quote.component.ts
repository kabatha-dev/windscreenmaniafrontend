import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-quote',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './generate-quote.component.html',
  styleUrls: ['./generate-quote.component.scss'],
})
export class GenerateQuoteComponent implements OnInit {
  quote: any;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    const state = history.state;
    if (state.quote) {
      this.quote = state.quote;
    }
  }

  approveQuote() {
    this.apiService.approveQuote(this.quote.quote_number).subscribe((orderResponse) => {
      this.router.navigate(['/order'], { state: { order: orderResponse } });
    });
  }
}
