import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HowtousePage } from './howtouse';

@NgModule({
  declarations: [
    HowtousePage,
  ],
  imports: [
    IonicPageModule.forChild(HowtousePage),
  ],
  exports: [
    HowtousePage
  ]
})
export class HowtousePageModule {}
