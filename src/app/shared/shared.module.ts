import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { MasterPageComponent } from './pages/master-page/master-page.component';


@NgModule({
  declarations: [
    MasterPageComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    MasterPageComponent
  ]
})
export class SharedModule { }
