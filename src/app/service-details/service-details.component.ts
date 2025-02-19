import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

interface VehicleDetails {
  make: string;
  model: string;
  year: string;
  registrationNumber: string;
}

interface UserDetails {
  fullName: string;
  email: string;
  kraPin: string;
}

interface VehicleMake {
  id: number;
  name: string;
}

interface VehicleModel {
  id: number;
  name: string;
}

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-details.component.html',
})
export class ServiceDetailsComponent implements OnInit {
  vehicleMakes: VehicleMake[] = [];
  vehicleModels: VehicleModel[] = [];
  selectedMake: string = '';
  selectedModel: string = '';
  selectedServices: number[] = [];
  vehicleDetails: VehicleDetails = { make: '', model: '', year: '', registrationNumber: '' };
  userDetails: UserDetails = { fullName: '', email: '', kraPin: '' };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchVehicleMakes();
    this.loadSelectedServices();
  }

  fetchVehicleMakes(): void {
    this.apiService.getVehicleMakes().subscribe({
      next: (makes: VehicleMake[]) => {
        this.vehicleMakes = makes;
      },
      error: (error: any) => console.error('Error fetching vehicle makes:', error)
    });
  }

  onMakeChange(): void {
    if (this.selectedMake) {
      this.apiService.getVehicleModels(+this.selectedMake).subscribe({
        next: (models: any[]) => {
          this.vehicleModels = models.map(model => ({ id: model.id, name: model.name }));
        },
        error: (error: any) => console.error('Error fetching vehicle models:', error)
      });
    } else {
      this.vehicleModels = [];
      this.selectedModel = '';
    }
  }

  loadSelectedServices(): void {
    const savedData = localStorage.getItem('selectedServicesData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.selectedServices = parsedData.selectedServices;
      this.userDetails = parsedData.userDetails;
    }
  }

  submitDetails(): void {
    if (!this.isFormValid()) {
      return;
    }

    const quoteData = {
      vehicle: {
        make: this.selectedMake,
        model: this.selectedModel,
        registrationNumber: this.vehicleDetails.registrationNumber
      },
      userDetails: this.userDetails,
      selectedServices: this.selectedServices
    };

    // Save quote data in localStorage before sending
    localStorage.setItem('quoteData', JSON.stringify(quoteData));

    // Send only necessary data to backend (excluding windscreen details)
    this.apiService.generateQuote(quoteData.vehicle.registrationNumber, this.selectedServices)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/quote-summary'], { 
            state: { 
              quote: response, 
              details: quoteData 
            }
          });
        },
        error: (error) => console.error('Error generating quote:', error)
      });
  }

  isFormValid(): boolean {
    return !!(this.selectedMake && this.selectedModel && this.vehicleDetails.registrationNumber.trim());
  }
}
