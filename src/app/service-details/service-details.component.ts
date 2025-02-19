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
  model: string;  // Ensure this property exists
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
      this.fetchWindscreenTypes();
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
          console.log('API Response:', models); // Log API response
          this.vehicleModels = models.map(model => ({
            id: model.id,
            name: model.name,
            model: model.model ?? model.name // Ensure 'model' is assigned correctly
          }));
        },
        error: (error: any) => console.error('Error fetching vehicle models:', error)
      });
    } else {
      this.vehicleModels = [];
      this.selectedModel = '';
    }
  }
  
  

  fetchWindscreenTypes(): void {
    this.apiService.getWindscreenTypes().subscribe({
      next: (types: WindscreenType[]) => {
        this.windscreenTypes = types;
      },
      error: (error: any) => console.error('Error fetching windscreen types:', error)
    });
  }

  onWindscreenTypeChange(): void {
    if (this.selectedWindscreenType) {
      this.fetchWindscreenCustomizations();
      this.calculateWindscreenCost();
    } else {
      this.windscreenCustomizations = [];
      this.selectedCustomization = '';
      this.totalWindscreenCost = 0;
    }
  }

  fetchWindscreenCustomizations(): void {
    this.apiService.getWindscreenCustomizations(+this.selectedWindscreenType).subscribe({
      next: (customizations: WindscreenCustomization[]) => {
        this.windscreenCustomizations = customizations;
      },
      error: (error: any) => console.error('Error fetching windscreen customizations:', error)
    });
  }

  onCustomizationChange(): void {
    this.calculateWindscreenCost();
  }

  calculateWindscreenCost(): void {
    const selectedType = this.windscreenTypes.find(
      type => type.id === +this.selectedWindscreenType
    );
    const selectedCustom = this.windscreenCustomizations.find(
      custom => custom.id === +this.selectedCustomization
    );

    this.totalWindscreenCost = (selectedType?.cost || 0) + (selectedCustom?.cost || 0);
  }

  onInsuranceChange(): void {
    if (this.hasInsurance) {
      this.fetchInsuranceProviders();
    } else {
      this.selectedInsuranceProvider = '';
      this.userDetails = {
        fullName: '',
        email: '',
        kraPin: ''
      };
    }
  }

  fetchInsuranceProviders(): void {
    this.apiService.getInsuranceProviders().subscribe({
      next: (providers: InsuranceProvider[]) => {
        this.insuranceProviders = providers;
      },
      error: (error: any) => console.error('Error fetching insurance providers:', error)
    });
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
      windscreen: this.hasWindscreenService ? {
        type: this.selectedWindscreenType,
        customization: this.selectedCustomization,
        totalCost: this.totalWindscreenCost,
        hasInsurance: this.hasInsurance,
        insuranceProvider: this.hasInsurance ? this.selectedInsuranceProvider : null
      } : null,
      userDetails: this.hasInsurance ? this.userDetails : null,
      selectedServices: this.selectedServices
    };

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
    // Check basic details
    if (!this.selectedMake || !this.selectedModel || !this.vehicleDetails.registrationNumber.trim()) {
      return false;
    }

    // Check windscreen details if service is selected
    if (this.hasWindscreenService) {
      if (!this.selectedWindscreenType || !this.selectedCustomization) {
        return false;
      }

      // Check insurance details if insurance is selected
      if (this.hasInsurance) {
        return !!(this.selectedInsuranceProvider &&
                 this.userDetails.fullName.trim() &&
                 this.userDetails.email.trim() &&
                 this.userDetails.kraPin.trim());
      }
    }

    return true;
  }
}
