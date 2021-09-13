import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PoliticasPage } from './politicas';

@NgModule({
  declarations: [
    PoliticasPage,
  ],
  imports: [
    IonicPageModule.forChild(PoliticasPage),
  ],
})
export class PoliticasPageModule {}
