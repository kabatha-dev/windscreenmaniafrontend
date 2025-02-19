import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-statement-of-account',
  standalone: true,
  imports: [HttpClientModule],  // Ensure HttpClientModule is imported
  templateUrl: './statement-of-account.component.html',
  styleUrls: ['./statement-of-account.component.scss'],
})
export class StatementOfAccountComponent {
  statement: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // @ts-ignore
    this.apiService.getStatementOfAccount().subscribe((response) => {
      this.statement = response;
    });
  }
}
