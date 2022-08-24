import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventoDetallePage } from "../../pages/evento-detalle/evento-detalle";
//Plugins
import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFireDatabase } from '@angular/fire/database';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { SMS } from '@ionic-native/sms';
import { Reservacion_1Page } from '../reservacion-1/reservacion-1';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';
import { PaginationService } from '../../app/pagination.service';


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
  //eventosF: any;
  //playerID: any;
  //userID: any;

  get dataEvento() {
    return this.page.data;
  }

  constructor(
    private socialSharing: SocialSharing,
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    public navParams: NavParams,
    public _cap: UsuarioProvider,
    private sms: SMS,
    public afs: AngularFirestore,
    public sucursalprovider: SucursalAltaProvider,
    public page: PaginationService
  ) {
    this.page.reset();
    //sacar el id del usuario del local storage
    this.uidUserSesion = localStorage.getItem('uid');
    console.log('id del usuario en eventos', this.uidUserSesion);

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
      uid: uid,
      sucursalID: uidSucursal,
      ClaveInstancia: getSucursal.ClaveInstancia,
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
}
