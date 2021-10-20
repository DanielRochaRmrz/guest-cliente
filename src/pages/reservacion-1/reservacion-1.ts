import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
// import { Observable } from 'rxjs-compat';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReservacionesPage } from '../reservaciones/reservaciones';
import { AngularFirestore } from '@angular/fire/firestore';
import { EventosPage } from '../eventos/eventos';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { LoginPage } from '../login/login';


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
  public filterPost: '';
  public filterPostCiudad: '';
  uidUserSesion: any;
  usuarios: any;
  ciudades: any;
  miUser: any = {};
  opcionS: string;
  estatus: number;
  sucursalesS = [];
  usuarioSu: any = {};
  invitado: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
  ) {
    // this.sucursales = afDB.list('sucursales').valueChanges();
    // this.uid = this.afAuth.auth.currentUser.uid;
    // console.log("uid desde Auth", this.uid);
    this.invitado = 1;
    this.uid = localStorage.getItem('uid');
    console.log('id del usuario en Reservacion', this.uid);
    if(localStorage.getItem('invitado') != null){
      this.invitado = localStorage.getItem('invitado');
    }
    
    console.log("INVITADO I",this.invitado);
    //obtener el id del user en sesion
    this.uidUserSesion = localStorage.getItem('uid');
    console.log('user en sucursales123', this.uidUserSesion);

    //obtener informacion de todas las sucursales
    this.afs.collection('sucursales').valueChanges().subscribe(s => {
      this.sucursales = s;
      console.log('sucursales', this.sucursales);
      // afDB.list('sucursales').valueChanges().subscribe( s => {
      //   this.sucursales = s;
      //   console.log('sucursale', this.sucursales);
    });

    //obtener informacion de todos los usuarios
    this.afs.collection('users').valueChanges().subscribe(user => {
      this.usuarios = user;
      console.log('usuarios2', this.usuarios);
    });

    //sacar todas las ciudades
    this.afs
      .collection("ciudades")
      .valueChanges()
      .subscribe(dataCiudad => {
        this.ciudades = dataCiudad;
        console.log('cudades', this.ciudades);
      });

    //obtener informacion de mi user
    this.afs
      .collection("users").doc(this.uidUserSesion)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
        console.log('Datos de mi usuario', this.miUser);
      });

    this.opcionS = this.navParams.get('opcionS');
    console.log("Opcion seleccionada", this.opcionS);

    this.estatus = this.navParams.get('estatus');
    console.log("Este es el estatus", this.estatus);

    //obtener informacion de todas las sucursales
    this.afs.collection('sucursales', ref => ref.where('tipo', '==', this.opcionS)).valueChanges().subscribe(su => {
      this.sucursalesS = su;
      console.log('sucursalesS', this.sucursalesS);
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Reservacion_1Page');
    console.log('filtro', this.filterPostCiudad);

  }
  reservar(idSucursal) {
    console.log('reservacion');
    this.afs.collection('users', ref => ref.where('uid', '==', idSucursal)).valueChanges().subscribe(su => {
      this.usuarioSu = su;
      console.log('usuarioSu', this.usuarioSu);

      localStorage.setItem('playerID', this.usuarioSu[0].playerID);
      console.log("playerID", this.usuarioSu[0].playerID);
      
    });

    // console.log("PlayerID", playerID);
    
    this.navCtrl.push(ReservacionesPage, { 'idSucursal': idSucursal });
  }
  // filtro( ) {
  //   this.modificador = this.modificador.filter(( sucursal ) => {
  //     console.log('respuesta de filtro', this.modificador);
  //     return sucursal.tipo == 'bar';
  //   })
  // }

  compartir(displayName, photoURL) {
    this.socialSharing
      .shareViaFacebook(displayName, null, photoURL)
      .then((resp) => console.log('Error -->', JSON.stringify(resp))) // se pudo compartir
      .catch((err) => console.log('Error -->', JSON.stringify(err))); // si sucede un error
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
    console.log('IMNVITADO');

    let alertMesas = this.alertCtrl.create({
      message:
        "<div text-center> Para generar un reservacion es necesario iniciar session " +
        "<br><br>"+
        "</div>",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
            console.log("Buy clicked");
          },
        },
        {
          text: 'Registrarme',
          handler: () => {
            console.log('Buy clicked');
            this.direccionarRegistro();
          }
        }
      ]
    });
    alertMesas.present();
 
  }

  direccionarRegistro(){
    console.log('registrase');
    localStorage.setItem("isLogin", 'false');
    localStorage.setItem("uid", '');
    localStorage.removeItem('invitado');
    this.navCtrl.setRoot(LoginPage);
    //this.navCtrl.setRoot(TipoLugarPage);
  }
}
