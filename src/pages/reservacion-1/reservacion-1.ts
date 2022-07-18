import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ReservacionesPage } from '../reservaciones/reservaciones';
import { AngularFirestore } from '@angular/fire/firestore';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { LoginPage } from '../login/login';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';


@IonicPage()
@Component({
  selector: 'page-reservacion-1',
  templateUrl: 'reservacion-1.html',
})
export class Reservacion_1Page {
  // sucursales: Observable<any[]>;
  sucursales = [];
  uid: string;
  reservacion: any = {};
  contador: any;
  estado: any;
  modificador: any;
  filterPost: any;
  filterPostCiudad: any;
  uidUserSesion: any;
  usuarios: any;
  ciudades: any;
  miUser: any = {};
  opcionS: string;
  estatus: number;
  sucursalesS: any = [];
  usuarioSu: any = {};
  invitado: any;
  loading: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public afs: AngularFirestore,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private _reservacionP: ReservacionProvider
  ) {
    this.invitado = 1;
    this.uid = localStorage.getItem('uid');
    if(localStorage.getItem('invitado') != null){
      this.invitado = localStorage.getItem('invitado');
    }
    this.uidUserSesion = localStorage.getItem('uid');

    //obtener informacion de todas las sucursales
    this.afs.collection('sucursales').valueChanges().subscribe(s => {
      this.sucursales = s;
    });

    //obtener informacion de todos los usuarios
    this.afs.collection('users').valueChanges().subscribe(user => {
      this.usuarios = user;
    });

    //obtener informacion de mi user
    this.afs
      .collection("users").doc(this.uidUserSesion)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
      });

    this.opcionS = this.navParams.get('opcionS');

    this.estatus = this.navParams.get('estatus');

  }

  ionViewDidLoad() {
    //sacar todas las ciudades
    this.getCiudades();
    this.getSucursales(this.opcionS);
  }
  
  async getCiudades () {
    this.ciudades = await this._reservacionP.getCiudades();
  }

  getSucursales(tipo: string) {
    this.presentLoadingSucursal();
    this._reservacionP.getSucursalesTipo(tipo).subscribe((data) => {
      this.sucursalesS = data;
      if (this.sucursalesS) {
        this.loading.dismiss();
      }
    });
  }

  presentLoadingSucursal() {
    this.loading = this.loadingCtrl.create({
      showBackdrop: true
    });
    this.loading.present();
  }

  reservar(idSucursal: string, ClaveInstancia: string, playerIDSuc: string) {
    this.navCtrl.push(ReservacionesPage, { 'idSucursal': idSucursal, 'ClaveInstancia': ClaveInstancia, 'playerIDSuc': playerIDSuc });
  }

  compartir(displayName, photoURL) {
    this.socialSharing
      .shareViaFacebook(displayName, null, photoURL)
      .then((resp) => {}) // se pudo compartir
      .catch((err) => {}); // si sucede un error
  }

  compartirInsta(displayName, photoURL) {
    this.socialSharing
      .shareViaFacebook(displayName, null, photoURL)
      .then(() => { }) // se pudo compartir
      .catch(() => { }); // si sucede un error
  }

  verEvento() {
    this.navCtrl.setRoot(TipoLugarPage);
  }

  verReservacion() {
    const estatus = 1;
    const opcionS = '';
    this.navCtrl.setRoot(Reservacion_1Page, { opcionS: opcionS, estatus: estatus });
  }

  invitadoAlert(){

    let alertMesas = this.alertCtrl.create({
      message:
        "<div text-center> Para generar un reservacion es necesario iniciar session " +
        "<br><br>"+
        "</div>",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {},
        },
        {
          text: 'Registrarme',
          handler: () => {
            this.direccionarRegistro();
          }
        }
      ]
    });
    alertMesas.present();
 
  }

  direccionarRegistro(){
    localStorage.setItem("isLogin", 'false');
    localStorage.setItem("uid", '');
    localStorage.removeItem('invitado');
    this.navCtrl.setRoot(LoginPage);
  }
}
