import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

interface Service {
  id: number;
  name: string;
  cost: string;
  selected: boolean;
}

@Component({
  selector: 'app-display-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './display-services.component.html',
  styleUrls: ['./display-services.component.scss'],
})
export class DisplayServicesComponent implements OnInit {
  hasWindscreenReplacement: boolean = false;
  hasInsurance: boolean = false;
  selectedInsurance: string = '';
  services: Service[] = [];
  selectedServices: number[] = [];
  vehicleId: string = '';
  insuranceProviders: { name: string }[] = [];
  
  // Initialize userDetails object
  userDetails = {
    fullName: '',
    kraPin: '',
    phone: ''
  };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchServices();
    this.fetchInsuranceProviders();
  }

  fetchServices() {
    this.apiService.getServices().subscribe(
      (response: any) => {
        // console.log('Raw response:', response); // Debug log
        
        this.services = response.map((service: any) => ({
          id: service.id,
          name: service.name,
          cost: service.cost,
          selected: false
        }));
        
        // console.log('Mapped services:', this.services); // Debug log
        
        this.hasWindscreenReplacement = this.services.some(
          service => service.name.toLowerCase() === 'windscreen replacement'
        );
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  fetchInsuranceProviders() {
    this.apiService.getInsuranceProviders().subscribe(
      (response: any) => {
        console.log('Fetched insurance providers:', response);
        this.insuranceProviders = response.map((provider: any) => ({ 
          name: provider.name 
        }));
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching insurance providers:', error);
      }
    );
  }

  selectServices() {
  if (this.services.some(service => service.selected)) {
    this.selectedServices = this.services
      .filter(service => service.selected)
      .map(service => service.id);
      
    // Navigate to service details with selected services
    this.router.navigate(['/service-details'], { 
      state: { 
        selectedServices: this.selectedServices 
      }
    });
  }
}

}
