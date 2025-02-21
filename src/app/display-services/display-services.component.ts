import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../services/shared.service';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { FooterComponent } from "../footer/footer.component";


interface Service {
  id: number;
  name: string;
  cost: string;
  selected: boolean;
}

interface WindscreenType {
  id: number;
  name: string;
}

interface WindscreenCustomization {
  id: number;
  name: string;
}

@Component({
  selector: 'app-display-services',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './display-services.component.html',
  styleUrls: ['./display-services.component.scss'],
})
export class DisplayServicesComponent implements OnInit {
  hasWindscreenReplacement: boolean = false;
  services: Service[] = [];
  selectedServices: number[] = [];
  vehicleId: string = '';
  insuranceProviders: { name: string }[] = [];

  // Windscreen Types & Customizations
  windscreenTypes: WindscreenType[] = [];
  windscreenCustomizations: WindscreenCustomization[] = [];
  selectedWindscreenType: number | null = null;
  selectedCustomization: number | null = null;
  selectedInsurance: string = '';

  // User Details
  userDetails = {
    fullName: '',
    kraPin: '',
    phone: ''
  };

  constructor(private apiService: ApiService, private router: Router, private sharedService: SharedService) {}

  ngOnInit() {
    this.fetchServices();
    this.fetchInsuranceProviders();
    this.fetchWindscreenTypes();
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
        this.insuranceProviders = response.map((provider: any) => ({ 
          name: provider.name 
        }));
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching insurance providers:', error);
      }
    );
  }

  fetchWindscreenTypes(): void {
    this.apiService.getWindscreenTypes().subscribe({
      next: (types: WindscreenType[]) => {
        this.windscreenTypes = types;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching windscreen types:', error);
      }
    });
  }
  
  onWindscreenTypeChange(): void {
    if (this.selectedWindscreenType !== null) {
      this.apiService.getWindscreenCustomizations(this.selectedWindscreenType).subscribe({
        next: (customizations: any[]) => {
          console.log('Fetched Customizations:', customizations);
          this.windscreenCustomizations = customizations.map(customization => ({
            id: customization.id,
            name: customization.customization_details // ✅ Fix property mapping
          }));
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching windscreen customizations:', error);
        }
      });
    } else {
      this.windscreenCustomizations = [];
      this.selectedCustomization = null;
    }
  }
  
  

  updateWindscreenStatus() {
    this.hasWindscreenReplacement = this.services.some(
      service => service.name.toLowerCase() === 'windscreen replacement' && service.selected
    );
  }


  selectServices() {
    this.selectedServices = this.services.filter(s => s.selected).map(s => s.id);

    const serviceData = {
      selectedServices: this.selectedServices,
      windscreenType: this.selectedWindscreenType,
      windscreenCustomizations: this.selectedCustomization,
      insuranceProvider: this.selectedInsurance,
      userDetails: this.userDetails
    };

    this.sharedService.setServiceData(serviceData);
    this.router.navigate(['/service-details']);
  }

  isServiceSelected(): boolean {
    return this.services.some(service => service.selected);
  }
  
  
}

