import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-qoute',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qoute.component.html',
  styleUrl: './qoute.component.scss'
})
export class QuoteComponent implements OnInit {
  allQuotes: any[] = [];
  submittedQuote: any | null = null;

  // Store names instead of IDs
  serviceDetails: { [key: number]: string } = {};
  vehicleDetails: { [key: number]: { make: string; model: string; registration_number: string } } = {};
  windscreenTypes: { [key: number]: string } = {};
  customizations: { [key: number]: string } = {};

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchQuotes();
    this.fetchServiceDetails();
    this.fetchVehicleDetails();
    this.fetchWindscreenTypes();
    this.fetchCustomizations();
  }

  fetchQuotes(): void {
    this.apiService.getQuotes().subscribe({
      next: (quotes: any[]) => {
        console.log('Fetched Quotes:', quotes); // Debugging line
        this.allQuotes = quotes.filter(q => q.status !== 'Rejected');
        this.submittedQuote = this.allQuotes.length > 0 ? this.allQuotes[0] : null;
      },
      error: (error: any) => console.error('Error fetching quotes:', error)
    });
  }

  fetchServiceDetails(): void {
    this.apiService.getServices().subscribe({
      next: (services: any[]) => {
        this.serviceDetails = services.reduce((acc, service) => {
          acc[service.id] = service.name;
          return acc;
        }, {});
      },
      error: (error: any) => console.error('Error fetching services:', error)
    });
  }

  fetchVehicleDetails(): void {
    this.apiService.getRegisteredVehicles().subscribe({
      next: (vehicles: any[]) => {
        console.log('Fetched vehicles:', vehicles);
        this.vehicleDetails = vehicles.reduce((acc, vehicle) => {
          acc[vehicle.id] = {
            make: vehicle.make,
            model: vehicle.model,
            registration_number: vehicle.registration_number
          };
          return acc;
        }, {});
      },
      error: (error: any) => console.error('Error fetching vehicles:', error)
    });
  }

  fetchWindscreenTypes(): void {
    this.apiService.getWindscreenTypes().subscribe({
      next: (types: any[]) => {
        this.windscreenTypes = types.reduce((acc, type) => {
          acc[type.id] = type.name;
          return acc;
        }, {});
      },
      error: (error: any) => console.error('Error fetching windscreen types:', error)
    });
  }

  fetchCustomizations(): void {
    const typeId = 1;
    this.apiService.getWindscreenCustomizations(typeId).subscribe({
      next: (customs: any[]) => {
        this.customizations = customs.reduce((acc, custom) => {
          acc[custom.id] = custom.name;
          return acc;
        }, {});
      },
      error: (error: any) => console.error('Error fetching customizations:', error)
    });
  }

  getServiceNames(serviceIds: number[]): string {
    return serviceIds.map(id => this.serviceDetails[id] || `Service ${id}`).join(', ');
  }

  getVehicleName(vehicleId: number | undefined): string {
    if (!vehicleId || !this.vehicleDetails[vehicleId]) return 'Unknown Vehicle';

    const vehicle = this.vehicleDetails[vehicleId];
    return `${vehicle.make} ${vehicle.model} <strong>(${vehicle.registration_number})</strong>`;
  }

  getWindscreenTypeName(typeId: number): string {
    return this.windscreenTypes[typeId] || `Type ${typeId}`;
  }

  getCustomizationName(customId: number): string {
    return this.customizations[customId] || `Customization ${customId}`;
  }

  approveQuote(quoteId: number): void {
    this.apiService.updateQuoteStatus(quoteId, 'Approved').subscribe({
      next: () => {
        console.log(`Quote ${quoteId} approved.`);
        this.apiService.createOrder(quoteId).subscribe({
          next: () => {
            console.log(`Order created for quote ${quoteId}.`);
            this.fetchQuotes();
          },
          error: (error: any) => console.error('Error creating order:', error)
        });
      },
      error: (error: any) => console.error('Error approving quote:', error)
    });
  }

  rejectQuote(quoteId: number): void {
    this.apiService.updateQuoteStatus(quoteId, 'Rejected').subscribe({
      next: () => {
        console.log(`Quote ${quoteId} rejected.`);
        this.fetchQuotes();
      },
      error: (error: any) => console.error('Error rejecting quote:', error)
    });
  }

  viewOrders(): void {
    this.router.navigate(['/order']);
  }
}
