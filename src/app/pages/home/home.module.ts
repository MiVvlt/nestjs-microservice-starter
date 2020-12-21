import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { homeRoutes } from './home.routes';


@NgModule( {
             declarations: [ HomeComponent ],
             imports     : [ CommonModule, RouterModule.forChild( homeRoutes ),
             ],
             providers   : [],
           } )
export class HomeModule {
}
