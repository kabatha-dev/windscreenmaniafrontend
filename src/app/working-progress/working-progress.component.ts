import { Component } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { NgIf} from '@angular/common';

@Component({
  selector: 'app-working-progress',
  standalone: true,
  imports: [HttpClientModule,NgIf],  // Ensure HttpClientModule is imported
  templateUrl: './working-progress.component.html',
  styleUrls: ['./working-progress.component.scss'],
})
export class WorkingProgressComponent {
  workInProgress: any;
}
