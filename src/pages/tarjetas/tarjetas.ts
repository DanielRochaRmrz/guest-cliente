import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AgregarTarjetaPage } from "../../pages/agregar-tarjeta/agregar-tarjeta";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { MisReservacionesPage } from "../mis-reservaciones/mis-reservaciones";
import { TipoLugarPage } from "../tipo-lugar/tipo-lugar";
import * as CryptoJS from "crypto-js";
@IonicPage()
@Component({
  selector: "page-tarjetas",
  templateUrl: "tarjetas.html",
})
export class TarjetasPage {
  miTarjeta: any = {};
  mes: string;
  anio: string;
  uid: any;
  //tarjetaAnterior: any;
  numTarjetas: any;
  idReservacion: any;
  seccion: any;
  miUser: any = {};
  invitado: any = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public usuarioProv: UsuarioProvider
  ) {
    //rescibir parametro de detalle-recervacion para checar tarjetas
    this.idReservacion = this.navParams.get("idReservacion");
    this.seccion = this.navParams.get("seccion");
    console.log("Id Reservacion en tarjetas: ", this.idReservacion);
    this.uid = localStorage.getItem("uid");
    console.log("id sesion", this.uid);
  }

  ionViewDidLoad() {
    this.invitado = localStorage.getItem("invitado");
    console.log("ionViewDidLoad TarjetasPage");
    this.getAllTarjetas();

    this.afs
      .collection("users")
      .doc(this.uid)
      .valueChanges()
      .subscribe((dataSu) => {
        this.miUser = dataSu;
        console.log("Datos de mi usuario", this.miUser);
      });
  }

  //obtener todas las tarjetas del usuario
  getAllTarjetas() {
    this.usuarioProv.getTarjetasUser(this.uid).subscribe((tarjeta) => {
      console.log(tarjeta);
      this.numTarjetas = tarjeta.length;
      tarjeta.forEach((tarjeta) => {
        let tarjetaID = tarjeta.idTarjeta;
        this.getTarjeta(tarjetaID);
      });
    });
  }

  async getTarjeta(tarjetaID: string) {
    this.miTarjeta = await this.usuarioProv.getTarjeta(tarjetaID);
    console.log('Tarjeta', this.miTarjeta.estatus);
    
    let bytesMes = CryptoJS.AES.decrypt(this.miTarjeta.mesExpiracion, "#C4rdGu35t");
    this.mes = bytesMes.toString(CryptoJS.enc.Utf8);
    let bytesAnio = CryptoJS.AES.decrypt(this.miTarjeta.anioExpiracion, "#C4rdGu35t");
    this.anio = bytesAnio.toString(CryptoJS.enc.Utf8);
  }

  //ir a la pantalla para registrar una tarjeta nueva
  agregarTarjeta() {
    this.navCtrl.setRoot(AgregarTarjetaPage);
  }

  //cambiar el estatus de la tarjeta a Eliminada
  eliminarTarjeta(idTarjeta) {
    this.usuarioProv.updateTarjetaEliminar(idTarjeta).then((respuesta: any) => {
      console.log("eliminada");
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
  }

  goBack() {
    this.navCtrl.setRoot(MisReservacionesPage);
  }

  goInicios() {
    this.navCtrl.setRoot(TipoLugarPage);
  }
}
