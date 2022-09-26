import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaginationService } from '../../app/pagination.service';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { UserProvider } from '../../providers/user/user';
import { HistorialDetallePage } from '../historial-detalle/historial-detalle';
import { HistorialPage } from '../historial/historial';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';

@IonicPage()
@Component({
  selector: 'page-historial-compartidas',
  templateUrl: 'historial-compartidas.html',
})
export class HistorialCompartidasPage {

  uid: string;
  misReservaciones: any = [];
  public telUser: string;
  miUser: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public page: PaginationService, public reservaProvider: ReservacionProvider,public userProvider: UserProvider,) {

    this.page.reset();
    this.uid = localStorage.getItem('uid');

  }

 async ngOnInit() {

    this.uid = localStorage.getItem('uid');

    this.miUser = await this.userProvider.getUser(this.uid);
    this.telUser = this.miUser.phoneNumber;
    
    this.page.initHistorialCompartidas('compartidas', 'fechaR', { reverse: true, prepend: false }, this.telUser);

    this.getAllReservaciones(this.telUser, this.uid);
  }

  ionViewDidLoad() {

  }

  getAllReservaciones(tel, uid) {
    this.reservaProvider.getReservacionesClienteHistorialCompartidas(tel, uid).subscribe((data) => {
      this.misReservaciones = data;
    });
  }

  verDetalle(idReservacion) {
    this.navCtrl.setRoot(HistorialDetallePage, {
      idReservacion: idReservacion
    });
  }

  goInicio(){
    this.navCtrl.setRoot(TipoLugarPage);
  }

  goHistorialNormales(){
    this.navCtrl.setRoot(HistorialPage);
  }

  scrollHandler(e) {

    if (e === 'bottom') {      
      
      console.log(e);
      
      this.page.moreHistorialCompartidas(this.telUser);
    }
  }

}
