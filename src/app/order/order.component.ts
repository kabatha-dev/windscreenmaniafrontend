import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

interface Order {
  approval_time: string;
  services: Service[];
  [key: string]: any;
}

interface Service {
  name: string;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgFor],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  constructor(private apiService: ApiService, private router: Router) {}


  ngOnInit(): void {
    this.fetchOrders();
  }
  
  fetchOrders(): void {
    this.apiService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders.map(order => ({
          ...order,
          services: order.services.join(", "),
        }));
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  createWorkProgress(order: Order): void {
    this.router.navigate(['/working-progress'], { queryParams: { orderNumber: order['order_number'] } });
  }
  
}
  