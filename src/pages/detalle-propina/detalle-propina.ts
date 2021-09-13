import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { MisReservacionesPage } from '../mis-reservaciones/mis-reservaciones';
import { EventosPage } from '../eventos/eventos';
/**
 * Generated class for the DetallePropinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-propina',
  templateUrl: 'detalle-propina.html',
})
export class DetallePropinaPage {
  totalPropina: any;
  uidUserSesion: any;
  miUser: any = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public afs: AngularFirestore
              ) {
    this.totalPropina = this.navParams.get("totalPropina");
    //sacar el id del usuario del local storage
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
    console.log('ionViewDidLoad DetallePropinaPage');
  }
  reservarFinal(){
    this.navCtrl.setRoot(EventosPage);
    this.navCtrl.setRoot(MisReservacionesPage);
  }

}
