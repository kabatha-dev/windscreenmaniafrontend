import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import {HttpClientModule} from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-generate-order',
  standalone: true,
  imports: [HttpClientModule,NgIf],  // Ensure HttpClientModule is imported
  templateUrl: './generate-order.component.html',
  styleUrls: ['./generate-order.component.scss'],
})
export class GenerateOrderComponent {
  orderData: any;

  constructor(private apiService: ApiService) {}

  generateOrder() {
    // Trigger order generation
  }

  approveOrder() {

  }
}
