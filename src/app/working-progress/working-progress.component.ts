import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-working-progress',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './working-progress.component.html',
  styleUrls: ['./working-progress.component.css'],
})
export class WorkingProgressComponent {
  workInProgressForm: FormGroup;
  images: File[] = [];
  pdfFile: File | null = null;
  orderDetails: any = null; // Store order details

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.workInProgressForm = this.fb.group({
      vehicle_reg_no: ['', Validators.required],
      description: ['', Validators.required],
      name: ['', Validators.required],
      krapin: [''],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
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

  fetchOrderDetails() {
    const vehicleRegNo = this.workInProgressForm.get('vehicle_reg_no')?.value;
    if (vehicleRegNo) {
      this.apiService.getOrderDetails(vehicleRegNo).subscribe({
        next: (data) => {
          this.orderDetails = data;
        },
        error: (err) => console.error('Error fetching order details:', err),
      });
    }
  }

  submitForm(): void {
    if (this.workInProgressForm.invalid || this.images.length < 3 || !this.pdfFile) {
      alert('Please fill in all fields and upload at least 3 images and a PDF.');
      return;
    }

    const formData = new FormData();
    Object.keys(this.workInProgressForm.controls).forEach((key) => {
      formData.append(key, this.workInProgressForm.get(key)?.value);
    });

    this.images.forEach((image) => formData.append('images', image));
    if (this.pdfFile) {
      formData.append('satisfactionNote', this.pdfFile);
    }

    this.apiService.submitWorkProgress(formData).subscribe({
      next: (response) => {
        alert('Work progress submitted successfully!');
        this.fetchOrderDetails(); // Refresh order details
        this.workInProgressForm.reset();
        this.images = [];
        this.pdfFile = null;
      },
      error: (error) => console.error('Error submitting work progress:', error),
    });
  }
}
