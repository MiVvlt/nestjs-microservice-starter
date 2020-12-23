import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable( {
               providedIn: 'root',
             } )
export class AuthGuard
  implements CanActivateChild {
  constructor( private authService: AuthService, private router: Router ) {}

  async canActivateChild( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Promise<boolean> {
    if ( !( await this.authService.isAuthenticated() ) ) {
      this.router.navigate( [ '/login' ] );
      return false;
    }
    return true;
  }

}
