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

interface WindscreenDetails {
  type: string;
  customization: string;
  cost: number;
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
  model: string;  
}

interface WindscreenType {
  id: number;
  name: string;
  cost: number;
}

interface WindscreenCustomization {
  id: number;
  name: string;
  cost: number;
}

interface InsuranceProvider {
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
  windscreenTypes: WindscreenType[] = [];
  windscreenCustomizations: WindscreenCustomization[] = [];
  totalWindscreenCost: number = 0;
  insuranceProviders: InsuranceProvider[] = [];
  
  selectedMake: string = '';
  selectedModel: string = '';
  selectedWindscreenType: string = '';
  selectedCustomization: string = '';
  selectedInsuranceProvider: string = '';
  
  hasWindscreenService: boolean = false;
  hasInsurance: boolean = false;
  selectedServices: number[] = [];
  
  vehicleDetails: VehicleDetails = {
    make: '',
    model: '',
    year: '',
    registrationNumber: ''
  };

  userDetails: UserDetails = {
    fullName: '',
    email: '',
    kraPin: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.selectedServices = navigation.extras.state['selectedServices'];
      this.hasWindscreenService = this.selectedServices.includes(1);
    }
  }

  ngOnInit(): void {
    this.fetchVehicleMakes();
    if (this.hasWindscreenService) {
      // this.fetchWindscreenTypes();
    }
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
          this.vehicleModels = models.map(model => ({
            id: model.id,
            name: model.name,
            model: model.model ?? model.name 
          }));
        },
        error: (error: any) => console.error('Error fetching vehicle models:', error)
      });
    } else {
      this.vehicleModels = [];
      this.selectedModel = '';
    }
  }
  


  submitDetails() {
    const requestData = {
      vehicle_make: this.selectedMake,
      vehicle_model: this.selectedModel,
      selected_services: this.selectedServices,
      windscreen_type: this.selectedWindscreenType,
      windscreen_customization: this.selectedCustomization,
      insurance_provider: this.selectedInsuranceProvider,
      user_details: this.userDetails,
    };

    this.apiService.registerVehicle(requestData).subscribe({
      next: (response) => {
        console.log('Vehicle registered successfully:', response);

        // Generate quote after registering the vehicle
        this.apiService.generateQuote(response.vehicleId, this.selectedServices).subscribe({
          next: (quoteResponse) => {
            console.log('Generated Quote:', quoteResponse);
            alert(`Quote Generated: ${quoteResponse.totalCost}`);

            // Submit the service after quote approval
            const serviceData = {
              vehicle_id: response.vehicleId,
              quote_number: quoteResponse.quoteNumber,
              selected_services: this.selectedServices,
              user_details: this.userDetails,
            };

            this.apiService.submitService(serviceData).subscribe({
              next: (submitResponse) => {
                console.log('Service submitted successfully:', submitResponse);
                alert('Service request submitted successfully!');
                this.router.navigate(['/confirmation']); // Redirect to confirmation page
              },
              error: (error) => {
                console.error('Error submitting service:', error);
                alert('Error submitting service request.');
              },
            });
          },
          error: (error) => {
            console.error('Error generating quote:', error);
            alert('Error generating quote.');
          },
        });
      },
      error: (error) => {
        console.error('Error registering vehicle:', error);
        alert('Error registering vehicle.');
      },
    });
  }

  isFormValid(): boolean {
    if (!this.selectedMake || !this.selectedModel || !this.vehicleDetails.registrationNumber.trim()) {
      return false;
    }

    if (this.hasWindscreenService && (!this.selectedWindscreenType || !this.selectedCustomization)) {
      return false;
    }

    if (this.hasInsurance) {
      return !!(this.selectedInsuranceProvider &&
        this.userDetails.fullName.trim() &&
        this.userDetails.email.trim() &&
        this.userDetails.kraPin.trim());
    }

    return true;
  }
}