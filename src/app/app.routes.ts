import { Routes } from '@angular/router';
import { RegisterCarComponent } from './register-car/register-car.component';
import { DisplayServicesComponent } from './display-services/display-services.component';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { StatementOfAccountComponent } from './statement-of-account/statement-of-account.component';
import { WorkingProgressComponent } from './working-progress/working-progress.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { QuoteComponent } from './qoute/qoute.component';
import { OrderComponent } from './order/order.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
// import { LayoutComponent } from './layout/layout.component'; // Uncomment if you have a LayoutComponent

export const routes: Routes = [
  { path: '', component: AdminDashboardComponent }, // Default route

  {
    path: '', // Parent route for child components
    // component: LayoutComponent, // Uncomment if needed
    children: [
      { path: 'register', component: RegisterCarComponent },
      { path: 'display-services', component: DisplayServicesComponent },
      { path: 'generate-invoice', component: GenerateInvoiceComponent },
      { path: 'statement-of-accounts', component: StatementOfAccountComponent },
      { path: 'working-progress', component: WorkingProgressComponent },
      { path: 'service-details', component: ServiceDetailsComponent },
      { path: 'quote', component: QuoteComponent },
      { path: 'order', component: OrderComponent },
    ],
  },

  // Redirect any unknown route to AdminDashboard
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
