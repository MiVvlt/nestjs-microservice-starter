import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicLayoutService } from '../../services/public-layout.service';
import { publicLayoutRoutes } from './public-layout.routes';
import { PublicLayoutComponent } from './public-layout.component';
import {
  ClrAlertModule,
  ClrDropdownModule,
  ClrIconModule,
  ClrVerticalNavModule,
} from '@clr/angular';


@NgModule( {
             declarations: [ PublicLayoutComponent ],
             imports     : [ CommonModule,
                             RouterModule.forChild( publicLayoutRoutes ),
                             ClrIconModule,
                             ClrDropdownModule,
                             ClrVerticalNavModule,
                             ClrAlertModule,
             ],
             providers   : [ PublicLayoutService ],
           } )
export class PublicLayoutModule {
}
