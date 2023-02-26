import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventoDetallePage } from "../../pages/evento-detalle/evento-detalle";
//Plugins
import { AngularFireDatabase } from '@angular/fire/database';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { Reservacion_1Page } from '../reservacion-1/reservacion-1';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';
import { PaginationService } from '../../app/pagination.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@IonicPage()
@Component({
  selector: "page-eventos",
  templateUrl: "eventos.html"
})
export class EventosPage implements OnInit {
  //hayMas:boolean= true;
  eventos: any[] = [];
  filterPost: "";
  filterPostCiudad: "";
  uidUserSesion: any;
  usuarios: any;
  sucursales: any;
  formatoFecha: any;
  ciudades: any;
  miUser: any = {};
  loading: any;
  playerId: any;

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    public navParams: NavParams,
    public _cap: UsuarioProvider,
    public afs: AngularFirestore,
    public sucursalprovider: SucursalAltaProvider,
    public page: PaginationService,
    public photoViewer: PhotoViewer,
    private iab: InAppBrowser
  ) {
    this.page.reset();
    this.uidUserSesion = localStorage.getItem('uid');
    console.log('id del usuario en eventos', this.uidUserSesion);

    this.afs
      .collection("ciudades")
      .valueChanges()
      .subscribe(dataCiudad => {
        this.ciudades = dataCiudad;
        console.log('c udades', this.ciudades);
      });

    //obtener informacion de mi user
    this.afs
      .collection("users").doc(this.uidUserSesion)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
        console.log('Datos de mi usuario', this.miUser);
        this.playerId = this.miUser.playerID;
      });

  }

  ngOnInit() {

    this.page.init('evento', 'fecha', { reverse: true, prepend: false });

  }

  scrollHandler(e) {

    if (e === 'bottom') {
      this.page.more()
    }
  }

  async verDetalle(uid: string, uidSucursal: string) {

    const sucursal: any = await this.sucursalprovider.getDataSucursal(uidSucursal);
    const getSucursal = JSON.parse(sucursal);

    this.navCtrl.setRoot(EventoDetallePage, {
      uidEvento: uid,
      sucursalID: uidSucursal,
      ClaveInstancia: getSucursal.ClaveInstancia,
      playerIdSuc: getSucursal.playerID
    });


  }

  verEvento() {
    this.navCtrl.setRoot(EventosPage);
  }

  verReservacion() {
    const estatus = 1;
    const opcionS = '';
    this.navCtrl.setRoot(Reservacion_1Page, { opcionS: opcionS, estatus: estatus });
  }

  goInicio() {

    this.navCtrl.setRoot(TipoLugarPage);
  }

  showImagFlyer(flyerImg: string) {
    const options = {
      share: true, // default is false
      closeButton: true, // default is true
      copyToReference: true, // default is false
      headers: "", // If it is not provided, it will trigger an exception
      piccasoOptions: {}, // If it is not provided, it will trigger an exception
    };
    this.photoViewer.show(flyerImg, "Flyer", options);
  }

  browser() {

    const browser = this.iab.create('https://www.eventbrite.com/e/zodiac-tickets-473390362317');

    browser.close();
  }
}
