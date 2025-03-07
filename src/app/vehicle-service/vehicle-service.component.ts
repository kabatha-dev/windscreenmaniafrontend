import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

interface Service {
  id: number;
  name: string;
  cost: string;
  selected: boolean;
}

interface VehicleMake {
  id: number;
  name: string;
}

interface VehicleModel {
  id: number;
  name: string;
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
  selector: 'app-vehicle-service',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './vehicle-service.component.html',
  styleUrls: ['./vehicle-service.component.scss'],
})
export class VehicleServiceComponent implements OnInit {
  vehicleForm: FormGroup;
  services: Service[] = [];
  vehicleMakes: VehicleMake[] = [];
  vehicleModels: VehicleModel[] = [];
  windscreenTypes: WindscreenType[] = [];
  windscreenCustomizations: WindscreenCustomization[] = [];
  selectedServices: number[] = [];
  hasWindscreenReplacement: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.vehicleForm = this.fb.group({
      registration_number: ['', [Validators.required, Validators.pattern(/^(K[A-Z]{2} \d{3}[A-Z]|UN \d{3}[A-Z]{1,2}|CD \d{3}[A-Z]{1,2}|AMB \d{3})$/)]],
      year_of_make: ['', [Validators.required, Validators.min(2000), Validators.max(2025)]],
      make: ['', Validators.required],
      model: ['', Validators.required],
      fullName: ['', Validators.required],
      kraPin: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      windscreenType: [''],
      windscreenCustomization: [''],
    });
  }

  ngOnInit(): void {
    this.fetchServices();
    this.fetchVehicleMakes();
    this.fetchWindscreenTypes();
  }

  fetchServices(): void {
    this.apiService.getServices().subscribe((response: any) => {
      this.services = response.map((service: any) => ({
        id: service.id,
        name: service.name,
        cost: service.cost,
        selected: false,
      }));
    });
  }

  fetchVehicleMakes(): void {
    this.apiService.getVehicleMakes().subscribe((makes: VehicleMake[]) => {
      this.vehicleMakes = makes;
    });
  }

  fetchVehicleModels(makeId: number): void {
    this.apiService.getVehicleModels(makeId).subscribe((models: VehicleModel[]) => {
      this.vehicleModels = models;
    });
  }

  fetchWindscreenTypes(): void {
    this.apiService.getWindscreenTypes().subscribe((types: WindscreenType[]) => {
      this.windscreenTypes = types;
    });
  }

  onMakeChange(): void {
    const makeId = this.vehicleForm.get('make')?.value;
    if (makeId) {
      this.fetchVehicleModels(makeId);
    }
  }

  onWindscreenTypeChange(): void {
    const windscreenTypeId = this.vehicleForm.get('windscreenType')?.value;
    if (windscreenTypeId) {
      this.apiService.getWindscreenCustomizations(windscreenTypeId).subscribe((customizations: WindscreenCustomization[]) => {
        this.windscreenCustomizations = customizations;
      });
    } else {
      this.windscreenCustomizations = [];
    }
  }

  updateWindscreenStatus(): void {
    this.hasWindscreenReplacement = this.services.some(
      (service) => service.name.toLowerCase() === 'windscreen replacement' && service.selected
    );
  }

  registerVehicle(): void {
    if (this.vehicleForm.valid) {
      const vehicleData = this.vehicleForm.value;
      this.apiService.registerVehicle(vehicleData).subscribe((response) => {
        if (response && response.services) {
          this.sharedService.setVehicleData(vehicleData);
          this.router.navigate(['/display-services'], { state: { services: response.services } });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
