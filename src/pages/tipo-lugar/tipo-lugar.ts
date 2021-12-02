import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  Platform,
} from "ionic-angular";
import { PushNotiProvider } from "../../providers/push-noti/push-noti";
import { EventosPage } from "../eventos/eventos";
import { Reservacion_1Page } from "../reservacion-1/reservacion-1";
import { DeviceProvider } from "../../providers/device/device";

@IonicPage()
@Component({
  selector: "page-tipo-lugar",
  templateUrl: "tipo-lugar.html",
})
export class TipoLugarPage {
  uidUserSesion: any;
  usuarios: any;
  miUser: any = {};

  constructor(
    public navCtrl: NavController,
    public afs: AngularFirestore,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public _providerPushNoti: PushNotiProvider,
    private _providerDevice: DeviceProvider,
    private platform: Platform
  ) {

    if (this.platform.is('cordova')) {
      this._providerDevice.deviceInfo();
    }
    
    this.menuCtrl.enable(true);
    //sacar el id del usuario del local storage
    this.uidUserSesion = localStorage.getItem("uid");
    // console.log("id del usuario en eventos", this.uidUserSesion);

    //obtener informacion de mi user
     const u = this.afs
      .collection("users")
      .doc(this.uidUserSesion)
      .valueChanges()
      .subscribe((dataSu) => {
        this.miUser = dataSu;
        // console.log("Datos de mi usuario", this.miUser);
      });

      u.unsubscribe();
  }

  

  ionViewDidLoad() {
    console.log("ionViewDidLoad TipoLugarPage");
  }

  goToEvento() {
    this.navCtrl.setRoot(EventosPage);
  }

  goToList(opcionS) {
    const estatus = 0;
    // console.log("esta es la opcion", opcionS);
    this.navCtrl.setRoot(Reservacion_1Page, {
      opcionS: opcionS,
      estatus: estatus,
    });
  }
}
