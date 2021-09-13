import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CroquisPage } from './croquis';

@NgModule({
  declarations: [
    CroquisPage,
  ],
  imports: [
    IonicPageModule.forChild(CroquisPage)
  ],
  exports: [
    CroquisPage
  ]
})
export class CroquisPageModule {}
