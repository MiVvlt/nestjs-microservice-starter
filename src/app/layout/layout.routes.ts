import { Routes } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { LayoutComponent } from './layout.component';

export const layoutRoutes: Routes = [ {
  path      : '',
  redirectTo: '/home',
  pathMatch : 'full',
}, {

  path     : '',
  component: LayoutComponent,
  children : [ {
    path        : 'home',
    loadChildren: () => {
      return import('../pages/home/home.module').then( m => m.HomeModule );
    },
  }, {
    path        : 'profile',
    canActivateChild : [ AuthGuard ],
    loadChildren: () => {
      return import('../pages/profile/profile.module').then( m => m.ProfileModule );
    },
  }, {
    path        : 'register',
    loadChildren: () => {
      return import('../pages/register/register.module').then( m => m.RegisterModule );
    },
  }, {
    path        : 'login',
    loadChildren: () => {
      return import('../pages/login/login.module').then( m => m.LoginModule );
    },
  },
  ],
}, {
  path      : '**',
  redirectTo: '/home',
},
];
