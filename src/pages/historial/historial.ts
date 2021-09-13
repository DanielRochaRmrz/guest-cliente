import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { AngularFireAuth } from 'angularfire2/auth';
import { HistorialDetallePage } from '../historial-detalle/historial-detalle';
import { AngularFirestore } from '@angular/fire/firestore';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';


@IonicPage()
@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage {
  eventos = [];
  uid: any;
  historial = [];
  sucursal=[];
  cont: any = 0;
  suma: any;
    miUser: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private afAuth: AngularFireAuth,
    public _providerReserva: ReservacionProvider,
  public afs: AngularFirestore
  ) {

    this.uid = localStorage.getItem("uid");
    console.log("quiero ver este", this.uid);
    this.getHistorial(this.uid);
    this.getSucursal();
    this.contador();



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorialPage');


    this.afs
      .collection("users").doc(this.uid)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
        console.log('Datos de mi usuario', this.miUser);
      });


  }

  presentModal(historia: any) {
console.log("historiaaaaaaaal", historia);
    // console.log("parametro enviado a modal", historia);
    // this.navCtrl.push(HistorialDetallePage, { 'historia': historia });
const modal =this.modalCtrl.create('HistorialDetallePage',{ 'historia': historia });
modal.present();
  }

  getHistorial(idx) {
    console.log("idUsuarioHistorial: ", idx);
      this._providerReserva.getHistorial(idx).subscribe(res => {
      console.log("Este es el resultado del historial: ", res);
      this.historial = res;

    });
  }

  getSucursal() {
      this._providerReserva.getSucursal().subscribe(res => {
      console.log("Este es el resultado de sucursal: ", res);
      this.sucursal = res;
    });
  }

  contador() {
    this.cont = this.cont + 1;
    console.log("contador", this.cont);
    this.cont = this.cont;
  }

  goInicio(){
    this.navCtrl.setRoot(TipoLugarPage);
  }

}
