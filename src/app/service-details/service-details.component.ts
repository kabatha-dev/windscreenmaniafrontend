import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule,isPlatformBrowser } from '@angular/common';
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
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.selectedServices = navigation.extras.state['selectedServices'];
      this.hasWindscreenService = this.selectedServices.includes(1);
    }

    // Load saved data from localStorage if exists
    this.loadSavedData();
  }

  ngOnInit(): void {
    this.fetchVehicleMakes();
    if (this.hasWindscreenService) {
      this.fetchWindscreenTypes();
    }
  }

   private loadSavedData(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedData = this.getFromLocalStorage();
        if (savedData) {
          this.selectedMake = savedData.vehicle_make || '';
          this.selectedModel = savedData.vehicle_model || '';
          this.selectedWindscreenType = savedData.windscreen_type || '';
          this.selectedCustomization = savedData.windscreen_customization || '';
          this.selectedInsuranceProvider = savedData.insurance_provider || '';
          this.userDetails = savedData.user_details || this.userDetails;
          this.vehicleDetails = savedData.vehicle_details || this.vehicleDetails;
          this.selectedServices = savedData.selected_services || [];
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }

  fetchVehicleMakes(): void {
    this.apiService.getVehicleMakes().subscribe(makes => {
      this.vehicleMakes = makes;
    });
  }

  fetchVehicleModels(makeId: number): void {
    this.apiService.getVehicleModels(Number(makeId)).subscribe(models => {
      this.vehicleModels = models.map(model => ({
        id: model.id,
        name: model.name,
        model: model.name
      }));
    });
  }

  fetchWindscreenTypes(): void {
    this.apiService.getWindscreenTypes().subscribe(types => {
      this.windscreenTypes = types;
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

  submitDetails(): void {
    console.log('Form submitted:', {
      vehicleMake: this.selectedMake,
      vehicleModel: this.selectedModel,
      userDetails: this.userDetails
    });
  }

  private getFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem('serviceDetails') || '{}');
  }
}
