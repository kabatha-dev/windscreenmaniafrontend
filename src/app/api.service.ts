import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Match the interfaces from your component
export interface VehicleMake {
  id: number;
  name: string;
}

export interface VehicleModel {
  id: number;
  name: string;
}

export interface WindscreenType {
  id: number;
  name: string;
  cost: number;
}

export interface WindscreenCustomization {
  id: number;
  name: string;
  cost: number;
}

export interface InsuranceProvider {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  registerVehicle(vehicleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register-vehicle/`, vehicleData);
  }

  generateQuote(vehicleId: string, selectedServices: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-quote/`, {
      vehicle_id: vehicleId,
      selected_services: selectedServices
    });
  }

  approveQuote(quoteNumber: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/approve-quote/${quoteNumber}/`, {});
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-services/`);
  }

  getVehicleMakes(): Observable<VehicleMake[]> {
    return this.http.get<VehicleMake[]>(`${this.apiUrl}/vehicle-makes/`);
  }

  getVehicleModels(makeId: number): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(`${this.apiUrl}/vehicle-models/${makeId}/`);
  }

  getWindscreenTypes(): Observable<WindscreenType[]> {
    return this.http.get<WindscreenType[]>(`${this.apiUrl}/windscreen-types/`);
  }

  getWindscreenCustomizations(typeId: number): Observable<WindscreenCustomization[]> {
    return this.http.get<WindscreenCustomization[]>(`${this.apiUrl}/windscreen-customizations/${typeId}/`);
  }

  getInsuranceProviders(): Observable<InsuranceProvider[]> {
    return this.http.get<InsuranceProvider[]>(`${this.apiUrl}/insurance-providers/`);
  }

  submitService(serviceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit-service/`, serviceData);
  }

  getQuotes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quotes/`);
  }
  
  
}
