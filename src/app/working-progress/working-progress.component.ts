import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { NgFor, NgIf } from '@angular/common';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-working-progress',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, CurrencyPipe, DatePipe],
  templateUrl: './working-progress.component.html',
  styleUrls: ['./working-progress.component.css'],
})
export class WorkingProgressComponent implements OnInit {
  workInProgressForm: FormGroup;
  orders: any[] = [];
  vehicles: any[] = [];
  users: any[] = [];
  selectedOrder: any = null;
  images: File[] = [];
  pdfFile: File | null = null;
  loadingOrders = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.workInProgressForm = this.fb.group({
      vehicle: ['', Validators.required],
      user: ['', Validators.required],
      vehicle_reg_no: ['', Validators.required],
      description: ['', Validators.required],
      name: ['', Validators.required],
      krapin: [''],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loadingOrders = true;
    this.apiService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loadingOrders = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.loadingOrders = false;
      },
    });
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

  onCreateWorkProgress(order: any) {
    this.selectedOrder = order;
    this.fetchVehiclesAndUsers();

    this.workInProgressForm.patchValue({
      vehicle_reg_no: order.vehicle_reg_no,
      name: order.customer_name,
      phoneNumber: order.phone,
      email: order.customer_email,
      description: `Service: ${order.service_type}`,
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
        this.fetchOrders();
        this.selectedOrder = null;
        this.workInProgressForm.reset();
        this.images = [];
        this.pdfFile = null;
      },
      error: (error) => console.error('Error submitting work progress:', error),
    });
  }
}
