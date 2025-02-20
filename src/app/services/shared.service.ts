import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private serviceData: any = null;

  setServiceData(data: any) {
    this.serviceData = data;
  }

  getServiceData() {
    return this.serviceData;
  }

  clearServiceData() {
    this.serviceData = null;
  }
}
