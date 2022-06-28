import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistorialPage } from './historial';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HistorialPage,
  ],
  imports: [
    IonicPageModule.forChild(HistorialPage),
    PipesModule
  ],
})
export class HistorialPageModule {}
