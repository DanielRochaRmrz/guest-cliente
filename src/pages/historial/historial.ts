import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { UserProvider } from '../../providers/user/user';
import { HistorialDetallePage } from '../historial-detalle/historial-detalle';
import { PaginationService } from '../../app/pagination.service';
import { HistorialCompartidasPage } from '../historial-compartidas/historial-compartidas';

@IonicPage()
@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage implements OnInit{
  uid: string;
  misReservaciones: any = [];
  idSucursal: any;
  idevento: any;
  public telUser: string;
  resCompartidas: any;
  miUser: any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public monRes: MonitoreoReservasProvider,
    public reservaProvider: ReservacionProvider,
    public afDB: AngularFireDatabase,
    public afs: AngularFirestore,
    public userProvider: UserProvider,
    public page: PaginationService,
  ) {

    this.page.reset();
  }

  ngOnInit() {
    
    this.page.initHistorial('reservaciones', 'fechaR', { reverse: true, prepend: false }, localStorage.getItem('uid'));

  }


  ionViewDidLoad() {
  //   //sacar el id del usuario del local storage
    this.uid = localStorage.getItem('uid');
    this.getAllReservaciones();
  }

  async getUsuario() {
    this.miUser = await this.userProvider.getUser(this.uid);
    this.telUser = this.miUser.phoneNumber;
  }
  
  //obtener todas las reservaciones de un usuario para mostrar el alert de que no hay reservaciones por mostrar
  getAllReservaciones() {
    this.reservaProvider.getReservacionesClienteHistorial(this.uid).subscribe((data) => {
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

  goHistorialCompartidas(){
    this.navCtrl.setRoot(HistorialCompartidasPage);
  }

  scrollHandler(e) {

    if (e === 'bottom') {      
      
      console.log(e);
      
      this.page.moreHistorial(localStorage.getItem('uid'));
    }
  }

}
