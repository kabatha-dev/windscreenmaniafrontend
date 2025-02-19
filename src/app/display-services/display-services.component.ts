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

interface InsuranceProvider {
  name: string;
}

interface UserDetails {
  fullName: string;
  kraPin: string;
  phone: string;
}

@Component({
  selector: 'app-display-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './display-services.component.html',
  styleUrls: ['./display-services.component.scss'],
})
export class DisplayServicesComponent implements OnInit {
  services: Service[] = [];
  selectedServices: number[] = [];
  insuranceProviders: InsuranceProvider[] = [];
  selectedInsurance: string = '';
  userDetails: UserDetails = { fullName: '', kraPin: '', phone: '' };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchServices();
    this.fetchInsuranceProviders();
  }

  fetchServices() {
    this.apiService.getServices().subscribe(
      (response: any) => {
        this.services = response.map((service: any) => ({
          id: service.id,
          name: service.name,
          cost: service.cost,
          selected: false
        }));
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  fetchInsuranceProviders() {
    this.apiService.getInsuranceProviders().subscribe(
      (response: any) => {
        this.insuranceProviders = response.map((provider: any) => ({ name: provider.name }));
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching insurance providers:', error);
      }
    );
  }

  selectServices() {
    this.selectedServices = this.services
      .filter(service => service.selected)
      .map(service => service.id);

    const selectionData = {
      selectedServices: this.selectedServices,
      selectedInsurance: this.selectedInsurance,
      userDetails: this.userDetails
    };

    // Save selection data to localStorage
    localStorage.setItem('selectedServicesData', JSON.stringify(selectionData));

    // Navigate to Service Details page
    this.router.navigate(['/service-details']);
  }
}
