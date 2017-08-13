import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetlerPage } from './getler';

@NgModule({
  declarations: [
    GetlerPage,
  ],
  imports: [
    IonicPageModule.forChild(GetlerPage),
  ],
  exports: [
    GetlerPage
  ]
})
export class GetlerPageModule {}
