import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElementolusturPage } from './elementolustur';

@NgModule({
  declarations: [
    ElementolusturPage,
  ],
  imports: [
    IonicPageModule.forChild(ElementolusturPage),
  ],
  exports: [
    ElementolusturPage
  ]
})
export class ElementolusturPageModule {}
