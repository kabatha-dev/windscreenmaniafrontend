import { Routes } from '@angular/router';
import { RegisterCarComponent } from './register-car/register-car.component';
import { DisplayServicesComponent } from './display-services/display-services.component';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { StatementOfAccountComponent } from './statement-of-account/statement-of-account.component';
import { WorkingProgressComponent } from './working-progress/working-progress.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { HeaderComponent } from './header/header.component';
import { QuoteComponent } from './qoute/qoute.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OrderComponent } from './order/order.component';




export const routes: Routes = [
  { path: '', component: RegisterCarComponent },
  { path: 'display-services', component: DisplayServicesComponent },
  { path: 'generate-invoice', component: GenerateInvoiceComponent },
    { path: 'statement-of-accounts', component: StatementOfAccountComponent },
  { path: 'working-progress', component: WorkingProgressComponent },
  { path: 'service-details', component: ServiceDetailsComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'quote', component: QuoteComponent },
  { path: 'footer', component: FooterComponent },
  {path: 'sidebar', component: SidebarComponent},
  {path: 'order', component: OrderComponent}
 

];

