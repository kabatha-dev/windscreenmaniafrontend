import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { NgFor, NgIf } from '@angular/common';

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

  // Store names instead of IDs
  serviceDetails: { [key: number]: string } = {};
  vehicleDetails: { [key: number]: string } = {};
  windscreenTypes: { [key: number]: string } = {};
  customizations: { [key: number]: string } = {};

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchQuotes();
    this.fetchServiceDetails();
    this.fetchVehicleDetails();
    this.fetchWindscreenTypes();
    this.fetchCustomizations();
    console.log('customizations', this.customizations)
  }

  fetchQuotes(): void {
    this.apiService.getQuotes().subscribe({
      next: (quotes: any[]) => {
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
          acc[vehicle.id] = `${vehicle.name} (${vehicle.registration_number})`; // Store both name & registration
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
    const typeId = 1; // Replace with the appropriate typeId
    this.apiService.getWindscreenCustomizations(typeId).subscribe({
      next: (customs: any[]) => {
        console.log('customizations', this.customizations)
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
    if (!vehicleId || !this.vehicleDetails[vehicleId]) return '';
  
    const vehicle = this.vehicleDetails[vehicleId];
    const parts = vehicle.match(/(.*) \((.*)\)/);
    
    if (!parts) return vehicle;
  
    const [, name, regNumber] = parts;
    return `${name} <strong>${regNumber}</strong>`;
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
