import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf,NgFor } from '@angular/common';

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
    private route: ActivatedRoute,
    private router: Router
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

  ngOnInit() {
    // Retrieve order details from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['selectedOrder']) {
      this.selectedOrder = navigation.extras.state['selectedOrder'];
      sessionStorage.setItem('selectedOrder', JSON.stringify(this.selectedOrder));
    } else {
      // If page is refreshed, retrieve from sessionStorage
      const savedOrder = sessionStorage.getItem('selectedOrder');
      this.selectedOrder = savedOrder ? JSON.parse(savedOrder) : null;
    }
  
    if (this.selectedOrder) {
      this.fetchVehiclesAndUsers();
      this.workInProgressForm.patchValue({
        vehicle_reg_no: this.selectedOrder.vehicle_reg_no,
        name: this.selectedOrder.customer_name,
        phoneNumber: this.selectedOrder.phone,
        email: this.selectedOrder.customer_email,
        description: `Service: ${this.selectedOrder.services.join(', ')}`,
      });
    }
  }
  

  fetchVehiclesAndUsers() {
    this.apiService.getRegisteredVehicles().subscribe({
      next: (vehicles) => (this.vehicles = vehicles),
      error: (error) => console.error('Error fetching vehicles:', error),
    });

    this.apiService.getUserDetails().subscribe({
      next: (users) => (this.users = users),
      error: (error) => console.error('Error fetching users:', error),
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
      next: () => {
        alert('Work progress submitted successfully!');
        this.workInProgressForm.reset();
        this.images = [];
        this.pdfFile = null;
      },
      error: (error) => console.error('Error submitting work progress:', error),
    });
  }
}
