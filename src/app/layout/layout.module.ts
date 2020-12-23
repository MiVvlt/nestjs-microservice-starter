import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ClrAlertModule,
  ClrDropdownModule,
  ClrIconModule,
  ClrMainContainerModule,
  ClrNavigationModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import { AuthService } from '../services/auth.service';
import { LayoutComponent } from './layout.component';
import { layoutRoutes } from './layout.routes';


@NgModule( {
             declarations: [ LayoutComponent ],
             imports: [ CommonModule,
                        RouterModule.forChild(layoutRoutes ),
                        ClrIconModule,
                        ClrDropdownModule,
                        ClrVerticalNavModule,
                        ClrAlertModule,
                        TranslateModule,
                        ClrMainContainerModule,
                        ClrNavigationModule,
             ],
             providers   : [ AuthService,
             ],
           } )
export class LayoutModule {
}
