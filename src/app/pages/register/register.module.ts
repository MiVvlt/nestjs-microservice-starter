import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';
import { registerRoutes } from './register.routes';


@NgModule( {
             declarations: [ RegisterComponent ],
             imports     : [ CommonModule, RouterModule.forChild( registerRoutes ),
             ],
           } )
export class RegisterModule {
}
