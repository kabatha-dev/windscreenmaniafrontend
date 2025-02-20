import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private serviceData: any = null;
  private vehicleData: any = null; 

  // Methods for service data
  setServiceData(data: any) {
    this.serviceData = data;
  }

  getServiceData() {
    return this.serviceData;
  }

  clearServiceData() {
    this.serviceData = null;
  }

  setVehicleData(data: { registration_number: string; year_of_make: string }) {
    this.vehicleData = data;
  }

  getVehicleData() {
    return this.vehicleData;
  }

  clearVehicleData() {
    this.vehicleData = null;
  }
}
