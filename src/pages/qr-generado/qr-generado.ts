import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { AngularFirestore } from '@angular/fire/firestore';
/**
 * Generated class for the QrGeneradoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-generado',
  templateUrl: 'qr-generado.html',
})
export class QrGeneradoPage {
  public idReservacion: string = null;
  idCompartir: any;
  miUser: any = {};
  uidUserSesion: any;
  //Crear variables para guardar los datos que se reciban de la reservacion
  private created_code = null;
  private qr_data = {
    "idReservacion": "",
    "mensaje": "",
    "idCompartir": ""
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore) {
    //recibir datos de la reservacion compartida
    this.idReservacion = this.navParams.get("idReservacion");
    this.idCompartir = this.navParams.get("idCompartir");
    //guardar datos recibidos en el arreglo creado qr_data
    this.qr_data.idReservacion = this.idReservacion;
    this.qr_data.mensaje = "Reservacion pagada";
    this.qr_data.idCompartir = this.idCompartir;
    this.created_code = JSON.stringify(this.qr_data);


    this.uidUserSesion = localStorage.getItem('uid');
    console.log('id del usuario en eventos', this.uidUserSesion);

    //obtener informacion de mi user
    this.afs
      .collection("users").doc(this.uidUserSesion)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
        console.log('Datos de mi usuario', this.miUser);
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrGeneradoPage');
  }
  goBack() {
    this.navCtrl.setRoot(ReservacionDetallePage, {
      idReservacion: this.idReservacion
    });
  }

  home() {
    this.navCtrl.setRoot(TipoLugarPage);
  }
}
