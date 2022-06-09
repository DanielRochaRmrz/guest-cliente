import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Reservacion_1Page } from './reservacion-1';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    Reservacion_1Page,
  ],
  imports: [
    IonicPageModule.forChild(Reservacion_1Page),
    PipesModule
  ],
})
export class Reservacion_1PageModule {}
