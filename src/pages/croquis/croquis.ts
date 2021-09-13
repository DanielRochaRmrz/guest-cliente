import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

import { CartaPage } from '../carta/carta';
import { ReservacionesPage } from '../reservaciones/reservaciones';

import { CroquisProvider } from '../../providers/croquis/croquis';

@IonicPage()
@Component({
  selector: 'page-croquis',
  templateUrl: 'croquis.html',
})
export class CroquisPage {

  miUser: any = {};
  url: SafeResourceUrl;
  params: any = {};

  constructor(
    public navCtrl       : NavController, 
    public navParams     : NavParams, 
    public croquisService: CroquisProvider,
    private sanitizer    : DomSanitizer
    ) {}

  ionViewDidLoad() {
    this.user();
    this.params = this.navParams.get('data');
    console.log('Params -->', this.params);
    
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`https://adminsoft.mx/operacion/login/cuadricula_cliente/1/30-08-21/${this.params.uidSucursal}/${this.params.uidReservacion}/${this.params.zona}/${this.params.fecha}/${this.params.hora}`);
  }

  async user(){
     this.miUser = await this.croquisService.getUser();
  }

  irCata(){
    this.navCtrl.push(CartaPage, {
      idReservacion: this.params.idReservacion,
      idSucursal: this.params.idSucursal,
      zona: this.params.zona,
      hora: this.params.hora,
      fecha: this.params.fecha
    });
  }

  irReservaciones(){
    this.navCtrl.push(ReservacionesPage, {
      idReservacion: this.params.idReservacion,
      idSucursal: this.params.idSucursal,
      zona: this.params.zona,
      hora: this.params.hora,
      fecha: this.params.fecha
    });
  }

}
