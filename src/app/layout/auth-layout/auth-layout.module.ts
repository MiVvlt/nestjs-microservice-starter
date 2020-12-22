import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { privateLayoutRoutes } from './auth-layout.routes';
import { AuthLayoutComponent } from './auth-layout.component';
import { PrivateLayoutService } from '../../services/private-layout.service';
import {
  ClrAlertModule,
  ClrDropdownModule,
  ClrIconModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import { AuthService } from '../../services/auth.service';


@NgModule( {
             declarations: [ AuthLayoutComponent ],
	           imports: [ CommonModule,
	                      RouterModule.forChild( privateLayoutRoutes ),
	                      ClrIconModule,
	                      ClrDropdownModule,
	                      ClrVerticalNavModule,
	                      ClrAlertModule,
	                      TranslateModule,
	           ],
             providers   : [ PrivateLayoutService, AuthService,
             ],
           } )
export class AuthLayoutModule {
}
