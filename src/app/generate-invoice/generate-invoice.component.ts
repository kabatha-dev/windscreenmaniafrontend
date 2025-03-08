import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss'],
  standalone: true,
  imports: [CommonModule] // ✅ Add CommonModule to imports
})
export class GenerateInvoiceComponent implements OnInit {
  invoices: any[] = [];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.fetchInvoices();
  }

  fetchInvoices(): void {
    this.invoiceService.getInvoices().subscribe((data) => {
      this.invoices = data;
    });
  }
}
