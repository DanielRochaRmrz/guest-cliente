import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallePropinaPage } from './detalle-propina';

@NgModule({
  declarations: [
    DetallePropinaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallePropinaPage),
  ],
})
export class DetallePropinaPageModule {}
