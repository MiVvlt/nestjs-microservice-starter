import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ClrAlertModule,
  ClrInputModule,
  ClrModalModule,
  ClrSelectModule,
  ClrWizardModule,
} from '@clr/angular';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { profileRoutes } from './profile.routes';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule( {
             declarations: [ ProfileComponent ],
             imports: [ CommonModule,
                        RouterModule.forChild( profileRoutes ),
                        ImageCropperModule,
                        ClrModalModule,
                        ClrWizardModule,
                        ClrInputModule,
                        FormsModule,
                        ClrSelectModule,
                        ClrAlertModule,
             ],
           } )
export class ProfileModule {
}
