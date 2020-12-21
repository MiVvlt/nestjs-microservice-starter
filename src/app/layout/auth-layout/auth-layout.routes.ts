import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';

export const privateLayoutRoutes: Routes = [ {
  path     : 'auth',
  component: AuthLayoutComponent,
  children : [ {
    path        : 'home',
    loadChildren: () => {
      return import('../../pages/home/home.module').then( m => m.HomeModule );
    },
  }, {
    path        : 'profile',
    loadChildren: () => {
      return import('../../pages/profile/profile.module').then( m => m.ProfileModule );
    },
  },
  ],
}, {
  path      : '**',
  redirectTo: '/home',
},
];
