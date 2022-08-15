import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AgregarTarjetaPage } from "../../pages/agregar-tarjeta/agregar-tarjeta";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { MisReservacionesPage } from '../mis-reservaciones/mis-reservaciones';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';

@IonicPage()
@Component({
  selector: 'page-tarjetas',
  templateUrl: 'tarjetas.html',
})
export class TarjetasPage {

  misTarjetas: any;
  uid: any;
  misTarjetasRegistradas: any;
  tarjetas: any;
  tarjetaActiva: any;
  //tarjetaAnterior: any;
  numTarjetas: any;
  idReservacion: any;
  seccion: any;
  miUser: any = {};
  invitado: any = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public usuarioProv: UsuarioProvider) {
    //rescibir parametro de detalle-recervacion para checar tarjetas
    this.idReservacion = this.navParams.get("idReservacion");
    this.seccion = this.navParams.get("seccion");
    //sacar el id del usuario del local storage
    console.log("Id Reservacion en tarjetas: ", this.idReservacion);
    this.uid = localStorage.getItem('uid');
    console.log('id sesion', this.uid);
    //this.tarjetaAnterior = localStorage.getItem('TarjetaId');
    //console.log('tarjeta anterior',this.tarjetaAnterior);
  }

  ionViewDidLoad() {
    this.invitado = localStorage.getItem('invitado');
    console.log('ionViewDidLoad TarjetasPage');
    this.getAllTarjetas();

    this.afs
      .collection("users").doc(this.uid)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
        console.log('Datos de mi usuario', this.miUser);
      });
  }

  //obtener todas las tarjetas del usuario
  getAllTarjetas() {
    //console.log('miuser',this.uid);
    this.usuarioProv.getTarjetasUser(this.uid).subscribe(tarjeta => {
      this.misTarjetas = tarjeta;
      this.numTarjetas = this.misTarjetas.length;
      console.log('misTarjetas', this.numTarjetas);
      //this.tarjetaAnterior = localStorage.getItem('TarjetaId');
      //console.log('misTarjetas',this.misTarjetas);
    });
  }

  //ir a la pantalla para registrar una tarjeta nueva
  agregarTarjeta() {
    this.navCtrl.setRoot(AgregarTarjetaPage);
  }

  //cambiar el estatus de la tarjeta a Eliminada
  eliminarTarjeta(idTarjeta) {
    this.usuarioProv.updateTarjetaEliminar(idTarjeta).then((respuesta: any) => {
      console.log('eliminada');
    });
  }

  //cambiar el estatus de la tarjeta a ACTIVA
  usarTarjeta(idTarjeta) {
    localStorage.setItem("TarjetaId", idTarjeta);
    //cambiar el estatus a activa cuando el usuario decide usar la tarjeta
    this.usuarioProv.updateTarjetaActiva(idTarjeta).then((respuesta: any) => {
      console.log("Respuesta: ", respuesta);
      if (respuesta.success == true) {
        console.log("Success: ", respuesta.success);
      }
    });
  };


  goBack() {
    this.navCtrl.setRoot(MisReservacionesPage);
  }

    goInicios(){
      this.navCtrl.setRoot(TipoLugarPage);
    }


  }
