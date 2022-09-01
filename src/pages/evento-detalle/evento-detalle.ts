import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { SocialSharing } from "@ionic-native/social-sharing";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
import { EventosPage } from "../eventos/eventos";
import { Reservacion_1Page } from "../reservacion-1/reservacion-1";
// import { AngularFirestore } from '@angular/fire/firestore';
import { ReservacionesPage } from '../reservaciones/reservaciones';
import { TabsPage } from "../tabs/tabs";
import { TipoLugarPage } from "../tipo-lugar/tipo-lugar";
@IonicPage()
@Component({
  selector: "page-evento-detalle",
  templateUrl: "evento-detalle.html"
})
export class EventoDetallePage {
  evento: any = {};
  key: null;
  sucursalID: any;
  mostrar: any;
  tabBarElement: any = ' ';
  miUser: any = {};
  uidUserSesion: any;
  ClaveInstancia: string = '';
  playerIDSuc: string = '';
  eventoUidSucursal:string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _cap: CargaArchivoProvider,
    public afs: AngularFirestore,
    private socialSharing: SocialSharing
  ) {

    this.evento.uid = this.navParams.get("uid");
    this.sucursalID = this.navParams.get("sucursalID");
    this.ClaveInstancia = this.navParams.get("ClaveInstancia");
    this.playerIDSuc = this.navParams.get("playerIdSuc");
    console.log('this.playerIDSuc -->', this.playerIDSuc);
    

    console.log("key", this.evento.uid);
    console.log("SucursalID", this.ClaveInstancia);
    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

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

      this.getDetails();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventoDetallePage");
    this.mostrar = true;
  }


  getDetails() {
    this._cap.getEvento(this.evento.uid).then(e => {
      this.evento = e;
      this.eventoUidSucursal = this.evento.uidSucursal;
      console.log("evento", this.evento.uidSucursal);
    });
  }

  Reservar(uid: string, idSucursal: string, fecha: string, hora: string) {
    console.log(idSucursal);

    this.navCtrl.push(ReservacionesPage, {
      uid: uid,
      idSucursal: idSucursal,
      fecha: fecha,
      hora: hora,
      ClaveInstancia: this.ClaveInstancia,
      playerIDSuc: this.playerIDSuc
    });
  }

  goBack() {
    this.navCtrl.setRoot(TabsPage);
  }

  verEvento() {
    this.navCtrl.setRoot(EventosPage);
  }

  verReservacion() {
    const estatus = 1;
    const opcionS = '';
    this.navCtrl.setRoot(Reservacion_1Page, {opcionS: opcionS, estatus: estatus});
  }

  compartir(evento: any) {
    this.socialSharing
      .shareViaFacebook(evento.titulo, null, evento.img)
      .then(() => { }) // se pudo compartir
      .catch(() => { }); // si sucede un error
  }

  compartirInsta(evento: any) {
    this.socialSharing
      .shareViaInstagram(evento.titulo, evento.img)
      .then(() => { }) // se pudo compartir
      .catch(() => { }); // si sucede un error
  }

  goInicio(){
    this.navCtrl.setRoot(TipoLugarPage);
  }

  

}
