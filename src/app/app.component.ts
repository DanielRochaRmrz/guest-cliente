import { Component, ViewChild } from "@angular/core";
import { Platform, MenuController, Nav } from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";

import { LoginPage } from "../pages/login/login";
import { NosotrosPage } from "../pages/nosotros/nosotros";
import { CartaPage } from "../pages/carta/carta";
import { Reservacion_1Page } from "../pages/reservacion-1/reservacion-1";
import { PerfilPage } from "../pages/perfil/perfil";
import { HistorialPage } from "../pages/historial/historial";
import { AngularFireAuth } from "angularfire2/auth";
import { UsuarioProvider, Credenciales } from "../providers/usuario/usuario";
import { ResumenPage } from "../pages/resumen/resumen";
import { MisReservacionesPage } from "../pages/mis-reservaciones/mis-reservaciones";
import { TarjetasPage } from "../pages/tarjetas/tarjetas";
import { PushNotiProvider } from "../providers/push-noti/push-noti";
import { CuponesPage } from "../pages/cupones/cupones";
import { TipoLugarPage } from "../pages/tipo-lugar/tipo-lugar";
import { SliderPage } from "../pages/slider/slider";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { SMS } from "@ionic-native/sms";

import { AppVersion } from "@ionic-native/app-version";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ReservacionProvider } from "../providers/reservacion/reservacion";
import * as firebase from "firebase";
@Component({
  templateUrl: "app.html",
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  db = firebase.firestore();
  user: Credenciales = {};
  rootPage: any;
  home = TipoLugarPage;
  nosotros = NosotrosPage;
  carta = CartaPage;
  perfil = PerfilPage;
  historial = HistorialPage;
  reservacion = Reservacion_1Page;
  reservaciones = MisReservacionesPage;
  pago = TarjetasPage;
  cupones = CuponesPage;
  slider = SliderPage;
  nombresUsers: any;
  us: any;
  uidUserSesion: any;
  nombresUserss: any = {};
  foto: number;
  invitado: any;
  version: any;
  token: string;
  userImage: any = "";

  constructor(
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private platform: Platform,
    public menuCtrl: MenuController,
    public usuarioProv: UsuarioProvider,
    private afAuth: AngularFireAuth,
    public _providerPushNoti: PushNotiProvider,
    private _providerReservacion: ReservacionProvider,
    public afs: AngularFirestore,
    private androidPermissions: AndroidPermissions,
    public SMS: SMS,
    private app: AppVersion
  ) {
    platform.ready().then(() => {
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString("#FD9530");
      splashScreen.hide();

      if (this.platform.is("android")) {
        this.androidPermissions
          .checkPermission(this.androidPermissions.PERMISSION.SEND_SMS)
          .then(
            (success) => {
              if (!success.hasPermission) {
                this.androidPermissions
                  .requestPermission(
                    this.androidPermissions.PERMISSION.SEND_SMS
                  )
                  .then(
                    (success) => {
                      // this.sendMessage();
                    },
                    (err) => {
                      console.error(err);
                    }
                  );
              } else {
                // this.sendMessage();
              }
            },
            (err) => {
              this.androidPermissions
                .requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
                .then(
                  (success) => {
                    // this.sendMessage();
                  },
                  (err) => {
                    // console.error(err);
                  }
                );
            }
          );
      } else {
        // this.sendMessage();
      }

      if (this.platform.is("cordova")) {
        this.app.getVersionCode().then((res) => {
          this.version = res;
          localStorage.setItem("versionApp", this.version);
        });
      }

      this.invitado = 1;

      if (localStorage.getItem("invitado") != null) {
        this.invitado = localStorage.getItem("invitado");
      }

      console.log(this.usuarioProv.usuario);
      this.user = this.usuarioProv.usuario;

      this.uidUserSesion = localStorage.getItem("uid");
      console.log("id del usuario en localStorage", this.uidUserSesion);

      //Verifica si el usuario esta logueado
      if (this.uidUserSesion != null || this.uidUserSesion != undefined) {
        this.afs
          .collection("users")
          .doc(this.uidUserSesion)
          .get()
          .subscribe((data) => {
            this.nombresUserss = data.data();
            console.log(
              "dato usuario existente",
              this.nombresUserss,
              this.nombresUserss.uid
            );

            // if (this.nombresUserss.active == false) {
            //   this.nav.setRoot(LoginPage);
            //   this.menuCtrl.close();
            //   if (this.platform.is('cordova')) {
            //     let tel = String(this.nombresUserss.phoneNumber);
            //     this.sendMessage(tel, "Cuenta inactiva, ponte en contactos con nosotros GuestResy.");
            //   }
            //   return;
            // }

            if (
              this.nombresUserss.uid != null ||
              this.nombresUserss.uid != undefined
            ) {
              if (this.nombresUserss.type == "u") {
                if (localStorage.getItem("isLogin") == "true") {
                  this.rootPage = TipoLugarPage;
                } else if (localStorage.getItem("isLogin") == "false") {
                  this.rootPage = SliderPage;
                } else if (localStorage.getItem("reservacion") == "true") {
                  this.nav.setRoot(ResumenPage, {
                    idReservacion: localStorage.getItem("idReservacion"),
                    idSucursal: localStorage.getItem("idSucursal"),
                    uid: localStorage.getItem("uidEvento"),
                  });
                }
              }
            } else if (
              this.nombresUserss.uid == null ||
              this.nombresUserss.uid == undefined
            ) {
              this.rootPage = SliderPage;
            }
          });
      } else {
        this.rootPage = SliderPage;
      }

      if (this.uidUserSesion != null || this.uidUserSesion != undefined) {
        //consultar tabla usuarios
        this.afs
          .collection("users")
          .doc(this.uidUserSesion)
          .get()
          .subscribe((data) => {
            this.nombresUserss = data.data();
            this.foto == 1;
            console.log(" foto es 1");
            console.log("Datos del usuario app", this.nombresUserss);
          });
      }

      if (this.uidUserSesion == null) {
        this.foto == 0;
        console.log(" foto es 0");
      }

      if (this.uidUserSesion != null || this.uidUserSesion != undefined) {
        this.afs
          .collection("users")
          .doc(this.uidUserSesion)
          .valueChanges()
          .subscribe((data: any) => {
            this.userImage = data.photoURL;
          });

        this.db
          .collection("reservaciones")
          .where("idUsuario", "==", this.uidUserSesion)
          .where("estatusFinal", "==", "rsv_incompleta")
          .get()
          .then((data) => {
            data.forEach((doc) => {
              console.log(doc.data());
              const reservacion = doc.data();
              const idReservacion = reservacion.idReservacion;
              if (idReservacion) {
                this._providerReservacion.deleteReservacion(idReservacion);
                localStorage.removeItem('idSucursal');
                localStorage.removeItem('zona');
                localStorage.removeItem('idReservacion');
                localStorage.removeItem('uidEvento');
                localStorage.removeItem('compartida');
                localStorage.removeItem('reservacion');
                localStorage.removeItem("contactosCompartidos");
                localStorage.removeItem("contactsSelected");

                localStorage.removeItem("id_cupon");
                localStorage.removeItem("numcupon");
                localStorage.removeItem("cuponn");
                localStorage.removeItem("cupon");
                localStorage.removeItem('cover');
              } else {
                console.log("No hay");
              }
            });
          });

        const ref = this.db
          .collection("compartidas")
          .where("idUsuario", "==", this.uidUserSesion)
          .where("estatusFinal", "==", "rsv_incompleta");
        ref.get().then((data) => {
          data.forEach((compartidas) => {
            if (compartidas) {
              compartidas.ref.delete();
            } else {
              console.log("No hay");
            }
          });
        });
      }
    });
  }

  //Menu de la aplicacion
  irHome(home: any) {
    console.log(home);
    this.rootPage = home;
    this.menuCtrl.close();
  }

  iraHome() {
    // this.rootPage = TipoLugarPage;
    this.nav.setRoot(TipoLugarPage);
    this.menuCtrl.close();
  }

  irMisreservaciones(reservaciones: any) {
    console.log(reservaciones);
    this.rootPage = reservaciones;
    this.menuCtrl.close();
  }

  iraMisreservaciones() {
    this.nav.setRoot(MisReservacionesPage);
    this.menuCtrl.close();
  }

  irPerfil(perfil: any) {
    console.log(perfil);
    this.rootPage = perfil;
    this.menuCtrl.close();
  }

  iraPerfil() {
    this.nav.setRoot(PerfilPage);
    this.menuCtrl.close();
  }

  irHistorial(historial: any) {
    console.log(historial);
    this.rootPage = historial;
    this.menuCtrl.close();
  }

  iraHistorial() {
    this.nav.setRoot(HistorialPage);
    this.menuCtrl.close();
  }

  irPago(pago: any) {
    console.log(pago);
    this.rootPage = pago;
    this.menuCtrl.close();
  }

  iraPago() {
    this.nav.setRoot(TarjetasPage);
    this.menuCtrl.close();
  }

  irCupones(cupones: any) {
    console.log(cupones);
    this.rootPage = cupones;
    this.menuCtrl.close();
  }

  iraCupones() {
    this.nav.setRoot(CuponesPage);
    this.menuCtrl.close();
  }

  salir(rootPage) {
    localStorage.setItem("isLogin", "false");
    this.afAuth.auth.signOut().then((res) => {
      this.usuarioProv.usuario = {};
      this.rootPage = LoginPage;
      this.menuCtrl.close();
    });
  }

  irsalir() {
    localStorage.removeItem("invitado");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("uid");
    this.afAuth.auth.signOut().then((res) => {
      this.usuarioProv.usuario = {};
      this.nav.setRoot(LoginPage);
      this.menuCtrl.close();
    });
  } //termina constructor

  irNosotros(nosotros: any) {
    console.log(nosotros);
    this.rootPage = nosotros;
    this.menuCtrl.close();
  }

  irCarta(carta: any) {
    console.log(carta);
    this.rootPage = carta;
    this.menuCtrl.close();
  }

  irReservacion(reservacion: any) {
    console.log(reservacion);
    this.rootPage = reservacion;
    this.menuCtrl.close();
  }

  irLogin(rootPage) {
    console.log(rootPage);
    this.rootPage = rootPage;
    this.menuCtrl.close();
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
