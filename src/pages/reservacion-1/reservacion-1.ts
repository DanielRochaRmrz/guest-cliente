import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ReservacionesPage } from '../reservaciones/reservaciones';
import { AngularFirestore } from '@angular/fire/firestore';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { LoginPage } from '../login/login';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { PaginationService } from '../../app/pagination.service';


@IonicPage()
@Component({
  selector: 'page-reservacion-1',
  templateUrl: 'reservacion-1.html',
})
export class Reservacion_1Page implements OnInit {
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
  tipoSucursal: string;
  hayDatos:any;
  suc: any = []


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public afs: AngularFirestore,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private _reservacionP: ReservacionProvider,
    public page: PaginationService,
  ) {

    this.page.reset();
    this.invitado = 1;
    this.uid = localStorage.getItem('uid');
    if(localStorage.getItem('invitado') != null){
      this.invitado = localStorage.getItem('invitado');
    }
    this.uidUserSesion = localStorage.getItem('uid');

    //obtener informacion de todas las sucursales
    // this.afs.collection('sucursales').valueChanges().subscribe(s => {
    //   this.sucursales = s;
    // });

    //obtener informacion de mi user
    this.afs
      .collection("users").doc(this.uidUserSesion)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
      });

    this.opcionS = this.navParams.get('opcionS');

    if(this.opcionS == "restaurante"){

      this.tipoSucursal = "Restaurantes";

    }else if(this.opcionS == "bar"){

      this.tipoSucursal = "Bares";

    }else if(this.opcionS == "antro"){

      this.tipoSucursal = "Antros";

    }

    this.estatus = this.navParams.get('estatus');

  }

  ionViewDidLoad() {
    //sacar todas las ciudades
    this.getCiudades();
    // this.getSucursales(this.opcionS);
    this.getAllSucursales();
  }

  ngOnInit() {

    this.page.initSucursales('sucursales', 'displayName', { reverse: true, prepend: false }, this.opcionS);

    this.page.data.forEach(element => {
     this.hayDatos =  element.length;
    });

    
    
  }  

  async getAllSucursales() {
    console.log('hola');
    this.suc = await this._reservacionP.getSucursalesTipo2(this.opcionS);
    console.log('Sucursale', this.suc );
  }

  scrollHandler(e) {

    console.log(e);   

    if (e === 'bottom') {
      this.page.moreSucursal(this.opcionS)
    }
  }
  
  async getCiudades () {
    this.ciudades = await this._reservacionP.getCiudades();
  }


  reservar(idSucursal: string, ClaveInstancia: string, playerIDSuc: string) {

    if(this.invitado != true){

      this.invitadoAlert();

    }else{

      this.navCtrl.push(ReservacionesPage, { 'idSucursal': idSucursal, 'ClaveInstancia': ClaveInstancia, 'playerIDSuc': playerIDSuc });

    }

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
