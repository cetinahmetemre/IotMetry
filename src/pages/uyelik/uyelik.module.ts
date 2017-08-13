import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UyelikPage } from './uyelik';

@NgModule({
  declarations: [
    UyelikPage,
  ],
  imports: [
    IonicPageModule.forChild(UyelikPage),
  ],
  exports: [
    UyelikPage
  ]
})
export class UyelikPageModule {}
