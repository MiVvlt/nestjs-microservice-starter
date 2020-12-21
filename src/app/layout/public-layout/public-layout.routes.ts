import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout.component';

export const publicLayoutRoutes: Routes = [ {
  path      : '',
  redirectTo: '/home',
  pathMatch : 'full',
}, {
  path     : '',
  component: PublicLayoutComponent,
  children : [ {
    path        : 'home',
    loadChildren: () => {
      return import('../../pages/home/home.module').then( m => m.HomeModule );
    },
  }, {
    path        : 'register',
    loadChildren: () => {
      return import('../../pages/register/register.module').then( m => m.RegisterModule );
    },
  }, {
    path        : 'login',
    loadChildren: () => {
      return import('../../pages/login/login.module').then( m => m.LoginModule );
    },
  },
  ],
},
];
