import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservacionDetallePage } from './reservacion-detalle';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ReservacionDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(ReservacionDetallePage),
    PipesModule
  ],
})
export class ReservacionDetallePageModule {}
