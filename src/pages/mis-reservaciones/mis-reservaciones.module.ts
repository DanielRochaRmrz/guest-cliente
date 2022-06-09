import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { MisReservacionesPage } from './mis-reservaciones';

@NgModule({
  declarations: [
    MisReservacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(MisReservacionesPage),
    PipesModule
  ],
})
export class MisReservacionesPageModule {}
