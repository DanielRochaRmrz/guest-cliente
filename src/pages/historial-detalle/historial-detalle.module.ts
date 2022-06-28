import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistorialDetallePage } from './historial-detalle';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HistorialDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(HistorialDetallePage),
    PipesModule
  ],
})
export class HistorialDetallePageModule {}
