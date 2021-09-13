import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginTelefonoPage } from './login-telefono';

@NgModule({
  declarations: [
    LoginTelefonoPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginTelefonoPage),
  ],
})
export class LoginTelefonoPageModule {}
