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
      // description: ['', Validators.required],
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
    const files = Array.from(event.target.files) as File[];
    if (files.length + this.images.length > 3) {
      alert('⚠️ You can only upload up to 3 images.');
      return;
    }
    this.images.push(...files);
  }

  onPdfUpload(event: any): void {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
      alert('⚠️ Only PDF files are allowed.');
      return;
    }
    this.pdfFile = file;
  }

  submitForm(): void {
    if (this.workInProgressForm.valid && this.selectedOrder) {
      this.loading = true;

      const formData = new FormData();
      formData.append('vehicle', this.workInProgressForm.value.vehicle);
      formData.append('user', this.workInProgressForm.value.user);
      formData.append('description', this.workInProgressForm.value.description);
      formData.append('order_number', this.selectedOrder.order_number);
      formData.append('quote_number', this.selectedOrder.quote_number);
      formData.append('total_cost', this.selectedOrder.total_cost);
      formData.append('services', JSON.stringify(this.selectedOrder.services));
      formData.append('approval_time', this.selectedOrder.approval_time || '');

      this.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      if (this.pdfFile) {
        formData.append('satisfaction_note', this.pdfFile);
      }

      this.apiService.submitWorkProgress(formData).subscribe({
        next: () => {
          console.log('✅ Work progress submitted successfully!');
          alert('✅ Work progress submitted successfully!');
          this.loading = false;
          this.workInProgressForm.reset();
          this.images = [];
          this.pdfFile = null;
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          console.error('❌ Error submitting work progress:', error);
          alert('❌ Error submitting work progress. Please try again.');
          this.loading = false;
        }
      });
    } else {
      alert('⚠️ Please fill in all required fields.');
    }
  }
}