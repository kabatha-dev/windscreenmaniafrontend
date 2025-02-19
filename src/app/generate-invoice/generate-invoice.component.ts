import { Component } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-generate-invoice',
  standalone: true,
  imports:[HttpClientModule],
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.scss'],
})
export class GenerateInvoiceComponent {}
