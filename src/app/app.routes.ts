import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

export const AppRoutes: Routes = [ { path: '', component: PublicLayoutComponent },
                                   { path: 'auth', component: AuthLayoutComponent },
];
