import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-working-progress',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './working-progress.component.html',
  styleUrls: ['./working-progress.component.css'],
})
export class WorkingProgressComponent implements OnInit {
  workInProgressForm: FormGroup;
  vehicles: any[] = [];
  users: any[] = [];
  selectedOrder: any = null;
  images: File[] = [];
  pdfFile: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.workInProgressForm = this.fb.group({
      vehicle: ['', Validators.required],
      user: ['', Validators.required],
      vehicle_reg_no: ['', Validators.required],
      description: ['', Validators.required],
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.selectedOrder = this.sharedService.getSelectedOrder(); // Fetch selected order
    
    if (!this.selectedOrder) {
      console.warn('⚠️ No order found. Redirecting to orders page.');
      this.router.navigate(['/orders']);
      return;
    }
    
    console.log('✅ Selected Order:', this.selectedOrder);
    this.fetchVehiclesAndUsers();
  }

  fetchVehiclesAndUsers(): void {
    this.apiService.getRegisteredVehicles().subscribe({
      next: (vehicles) => (this.vehicles = vehicles),
      error: (error) => console.error('Error fetching vehicles:', error),
    });

    this.apiService.getUserDetails().subscribe({
      next: (users) => (this.users = users),
      error: (error) => console.error('Error fetching users:', error),
    });
  }

  getServicesList(): string {
    if (this.selectedOrder && Array.isArray(this.selectedOrder.services)) {
      return this.selectedOrder.services.join(', ');
    }
    return this.selectedOrder?.services || 'No services available';
  }

  onImageUpload(event: any): void {
    const files = event.target.files;
    if (files.length > 3) {
      alert('You can only upload up to 3 images.');
      return;
    }
    this.images = Array.from(files);
  }

  onPdfUpload(event: any): void {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    this.pdfFile = file;
  }

  submitForm(): void {
    if (this.workInProgressForm.valid) {
      const formData = new FormData();
      formData.append('order', JSON.stringify(this.selectedOrder));
      formData.append('vehicleId', this.workInProgressForm.value.vehicle);
      formData.append('userId', this.workInProgressForm.value.user);
      formData.append('description', this.workInProgressForm.value.description);

      this.images.forEach((image) => formData.append('images', image));
      if (this.pdfFile) {
        formData.append('satisfactionNote', this.pdfFile);
      }

      this.apiService.submitWorkProgress(formData).subscribe({
        next: () => {
          alert('✅ Work progress submitted successfully!');
          this.workInProgressForm.reset();
          this.images = [];
          this.pdfFile = null;
          this.router.navigate(['/orders']);
        },
        error: (error) => console.error('❌ Error submitting work progress:', error),
      });
    }
  }
}
