import { Component, OnInit } from '@angular/core';
import { StatementOfAccountService } from '../services/statement-of-account.service';
import { NgFor } from '@angular/common'; // Import NgFor

@Component({
  selector: 'app-statement-of-account',
  standalone: true,
  imports: [NgFor], // Add NgFor here
  templateUrl: './statement-of-account.component.html',
  styleUrls: ['./statement-of-account.component.scss']
})
export class StatementOfAccountComponent implements OnInit {
  statements: any[] = [];

  constructor(private statementService: StatementOfAccountService) {}

  ngOnInit(): void {
    this.fetchStatements();
  }

  fetchStatements(): void {
    this.statementService.getStatements().subscribe(
      (data: any) => {
        this.statements = data;
      },
      (error: any) => {
        console.error('Error fetching statements:', error);
      }
    );
  }
}
