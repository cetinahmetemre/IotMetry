import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerilerPage } from './veriler';

@NgModule({
  declarations: [
    VerilerPage,
  ],
  imports: [
    IonicPageModule.forChild(VerilerPage),
  ],
  exports: [
    VerilerPage
  ]
})
export class VerilerPageModule {}
