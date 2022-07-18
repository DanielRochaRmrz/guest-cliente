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
import { UserProvider } from "../../providers/user/user";
import { LoginPage } from '../login/login';
import { SMS } from "@ionic-native/sms";

@IonicPage()
@Component({
  selector: "page-tipo-lugar",
  templateUrl: "tipo-lugar.html",
})
export class TipoLugarPage {
  uidUserSesion: any;
  usuarios: any;
  miUser: any = {};
  user:any = {};

  constructor(
    public navCtrl: NavController,
    public afs: AngularFirestore,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public _providerPushNoti: PushNotiProvider,
    private _providerDevice: DeviceProvider,
    private _providerUser: UserProvider,
    private platform: Platform,
    public SMS: SMS,
  ) {

    
    
    this.menuCtrl.enable(true);
    //sacar el id del usuario del local storage
    this.uidUserSesion = localStorage.getItem("uid");
    // console.log("id del usuario en eventos", this.uidUserSesion);

    this.afs
          .collection("users")
          .doc(this.uidUserSesion)
          .get()
          .subscribe((data) => {
            this.user = data.data();
            console.log(
              "dato usuario existente",
              this.user,
              this.user.uid
            );

            if (this.user.active == false) {
              this.navCtrl.setRoot(LoginPage);
              this.menuCtrl.close();
              if (this.platform.is('cordova')) {
                let tel = String(this.user.phoneNumber);
                this.sendMessage(tel, "Cuenta inactiva, ponte en contactos con nosotros GuestResy.");
              }
              return;
            }
          });

  }

  

  ionViewDidLoad() {
    console.log("ionViewDidLoad TipoLugarPage");
    this.getInfouser(this.uidUserSesion);
  }

  ionViewWillUnload() {  }

  async getInfouser(uid: string) {
    this.miUser = await this._providerUser.getUser(uid);
    if (this.platform.is('cordova')) {
      this._providerDevice.deviceInfo(this.miUser.uid);
    }
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

  sendMessage(tel: string, msj: string) {
    if (this.SMS) {
      this.SMS.send(tel, msj)
        .then((succes) => {
          console.log(succes);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

}
