import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginTelDatosPage } from './login-tel-datos';

@NgModule({
  declarations: [
    LoginTelDatosPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginTelDatosPage),
  ],
})
export class LoginTelDatosPageModule {}
