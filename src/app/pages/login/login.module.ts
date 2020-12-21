import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { loginRoutes } from './login.routes';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ClrInputModule,
  ClrPasswordModule,
} from '@clr/angular';


@NgModule( {
             declarations: [ LoginComponent ],
             imports     : [ CommonModule,
                             RouterModule.forChild( loginRoutes ),
                             ReactiveFormsModule,
                             ClrInputModule,
                             ClrPasswordModule,
             ],
           } )
export class LoginModule {
}
