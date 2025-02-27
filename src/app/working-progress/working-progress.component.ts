import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-working-progress',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './working-progress.component.html',
  styleUrls: ['./working-progress.component.css'],
})
export class WorkingProgressComponent {
  workInProgressForm: FormGroup;
  images: File[] = [];
  pdfFile: File | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.workInProgressForm = this.fb.group({
      vehicle_reg_no: ['', Validators.required], // Updated to match backend field
      description: ['', Validators.required], // Added missing field
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

  submitForm(): void {
    if (this.workInProgressForm.invalid || this.images.length < 3 || !this.pdfFile) {
      alert('Please fill in all fields and upload at least 3 images and a PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('vehicle_reg_no', this.workInProgressForm.get('vehicle_reg_no')?.value);
    formData.append('description', this.workInProgressForm.get('description')?.value);
    formData.append('name', this.workInProgressForm.get('name')?.value);
    formData.append('krapin', this.workInProgressForm.get('krapin')?.value);
    formData.append('phoneNumber', this.workInProgressForm.get('phoneNumber')?.value);
    formData.append('email', this.workInProgressForm.get('email')?.value);

    this.images.forEach((image) => {
      formData.append('images', image);
    });

    if (this.pdfFile) {
      formData.append('satisfactionNote', this.pdfFile);
    }

    this.apiService.submitWorkProgress(formData).subscribe({
      next: (response: any) => {
        console.log('Submission successful:', response);
        alert('Work progress submitted successfully!');
        this.workInProgressForm.reset();
        this.images = [];
        this.pdfFile = null;
      },
      error: (error: any) => {
        console.error('Error submitting work progress:', error);
      },
    });
  }
}
