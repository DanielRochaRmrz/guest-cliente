import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { CartaEditarPage } from "../carta-editar/carta-editar";
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { UserProvider } from '../../providers/user/user';
import { PushNotiProvider } from '../../providers/push-noti/push-noti';



@IonicPage()
@Component({
  selector: 'page-mis-reservaciones',
  templateUrl: 'mis-reservaciones.html',
})
export class MisReservacionesPage {
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
    public _pushNotiProvider : PushNotiProvider
  ) {}

  ionViewDidLoad() {
    //sacar el id del usuario del local storage
    this.uid = localStorage.getItem('uid');
    this.getUsuario();
    this.getAllReservaciones();
  }

  async getUsuario() {
    this.miUser = await this.userProvider.getUser(this.uid);
    this.telUser = this.miUser.phoneNumber;
    this.getReservacionCompartida(this.telUser);
  }
  
  //obtener todas las reservaciones de un usuario
  getAllReservaciones() {
    this.reservaProvider.getReservacionesCliente(this.uid).subscribe((data) => {
      this.misReservaciones = data;
    });
  }


  //obtener el telefono del usuario en sesion
  getReservacionCompartida(telefono: string) {
        //obtener reservaciones compartidas en las que esta el usuario
        this.reservaProvider.getReservacionCompartida(telefono).subscribe((resCom) => {
          this.resCompartidas = resCom;
        });
  }

  verDetalle(idReservacion) {
    this.navCtrl.setRoot(ReservacionDetallePage, {
      idReservacion: idReservacion
    });
  }

  verCarta(idReservacion, idSucursal, idevento) {
    this.navCtrl.setRoot(CartaEditarPage, {
      idReservacion: idReservacion,
      idSucursal: idSucursal,
      idevento: idevento
    });
  }

  CancelarReservacion(idReservacion) {
    this.reservaProvider
      .updateReservacioCancelado(idReservacion)
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
        if (respuesta.success == true) {
          console.log("Success: ", respuesta.success);
        }
      });
    this.navCtrl.setRoot(MisReservacionesPage, {
      idReservacion: idReservacion
    });
  }

  aceptarCompartir(idCompartir: string, idReservacion: string) {
    //Consulta para mandar el estatus aceptado
    this.reservaProvider
      .updateCompartirAceptar(idCompartir)
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
        if (respuesta.success == true) {
          console.log("Success: ", respuesta.success);
        }
      });
    this._pushNotiProvider.PushNotiAceptaReservacion(idReservacion, this.miUser.displayName);
    this.navCtrl.setRoot(MisReservacionesPage, {
      idReservacion: idReservacion
    });
  }

  rechazarCompartir(idCompartir, idReservacion) {
    this.reservaProvider
      .updateCompartirRechazar(idCompartir)
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
        if (respuesta.success == true) {
          console.log("Success: ", respuesta.success);
        }
      });
    this.navCtrl.setRoot(MisReservacionesPage, {
      idReservacion: idReservacion
    });
  }


  goInicio(){
    this.navCtrl.setRoot(TipoLugarPage);
  }


}
