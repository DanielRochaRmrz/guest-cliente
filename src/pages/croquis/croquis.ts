import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  uid: string;
  
  constructor(
    public navCtrl        : NavController, 
    public navParams      : NavParams,
    public alertCtrl      : AlertController,
    public croquisService : CroquisProvider,
    private sanitizer     : DomSanitizer
    ) {}

  ionViewDidLoad() {
    this.uid = localStorage.getItem('uid');
    this.user();
    this.params = this.navParams.get('data');
    console.log('Params -->', this.params);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`https://adminsoft.mx/operacion/login/cuadricula_cliente/${this.params.idSucursal}/${this.params.idReservacion}/${this.params.zona}/${this.params.zona_consumo}/${this.params.fecha}/${this.params.hora}`);
    console.log('Url -->', this.url);
    
  }

  async user(){
     this.miUser = await this.croquisService.getUser(this.uid);
  }

  async irCata(){
    const rsvp: any = await this.croquisService.getRsvpHttp(this.params.idReservacion);
    if (rsvp.length == 0) {
      const alert = this.alertCtrl.create({
        title: 'Seleciona tu mesa para continuar',
        buttons: ['Aceptar']
      });
      alert.present();
    } else {
      this.navCtrl.push(CartaPage, {
        idReservacion: this.params.idReservacion,
        idSucursal: this.params.idSucursal,
        zona: this.params.zona,
        hora: this.params.hora,
        fecha: this.params.fecha
      });
    }
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
