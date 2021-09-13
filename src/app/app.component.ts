import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFirestore } from '@angular/fire/firestore';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { NosotrosPage } from "../pages/nosotros/nosotros";
import { CartaPage } from "../pages/carta/carta";
import { Reservacion_1Page } from "../pages/reservacion-1/reservacion-1";
import { PerfilPage } from "../pages/perfil/perfil";
import { HistorialPage } from "../pages/historial/historial";
import { AngularFireAuth } from "angularfire2/auth";
import { UsuarioProvider, Credenciales } from "../providers/usuario/usuario";
import { ResumenPage } from '../pages/resumen/resumen';
import { MisReservacionesPage } from '../pages/mis-reservaciones/mis-reservaciones';
import { TarjetasPage } from '../pages/tarjetas/tarjetas';
import { TelefonoUserPage } from "../pages/telefono-user/telefono-user";
import { PushNotiProvider } from '../providers/push-noti/push-noti';
import { Contacts } from '@ionic-native/contacts';


import * as firebase from 'firebase/app';
import "firebase/database";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { CuponesPage } from '../pages/cupones/cupones';
import { TipoLugarPage } from "../pages/tipo-lugar/tipo-lugar";
import { SliderPage } from "../pages/slider/slider";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  user: Credenciales = {};

  rootPage: any;
  // home = TabsPage;
  home = TipoLugarPage;
  nosotros = NosotrosPage;
  carta = CartaPage;
  perfil = PerfilPage;
  historial = HistorialPage;
  reservacion = Reservacion_1Page;
  reservaciones = MisReservacionesPage;
  pago = TarjetasPage;
  cupones = CuponesPage
  slider = SliderPage;
  nombresUsers: any;
  us: any;
  uidUserSesion: any;
  nombresUserss: any = {};
  foto: number;
  invitado: any;
  constructor(
    private platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public usuarioProv: UsuarioProvider,
    private afAuth: AngularFireAuth,
    public _providerPushNoti: PushNotiProvider,
    private fb: Facebook,
    public afs: AngularFirestore,
    private contacts: Contacts
     
    ) {
      this.invitado=1;

      if(localStorage.getItem('invitado') != null){
        this.invitado = localStorage.getItem('invitado');
      }
      

    console.log(this.usuarioProv.usuario);
    this.user = this.usuarioProv.usuario;

    this.uidUserSesion = localStorage.getItem('uid');
    console.log('id del usuario en localStorage', this.uidUserSesion);


    //Verifica si el usuario esta logueado
    if (this.uidUserSesion != null || this.uidUserSesion != undefined) {
      this.afs.collection("users").doc(this.uidUserSesion).valueChanges().subscribe(data => {
        this.nombresUserss = data;
        console.log("dato usuario existente", this.nombresUserss, this.nombresUserss.uid);

        if (this.nombresUserss.uid != null || this.nombresUserss.uid != undefined) {
          if (this.nombresUserss.type == 'u') {

            if (localStorage.getItem("isLogin") == "true") {
              this.nav.setRoot(TipoLugarPage, { 'uid': this.nombresUserss.uid });
            }
            else if (localStorage.getItem("isLogin") == "false") {
              this.nav.setRoot(SliderPage);
            }
            else if (localStorage.getItem("reservacion") == "true") {
              this.nav.setRoot(ResumenPage, {
                idReservacion: localStorage.getItem("idReservacion"),
                idSucursal: localStorage.getItem("idSucursal"),
                uid: localStorage.getItem("uidEvento")
              });
            }

          }
        } 
        else if(this.nombresUserss.uid == null || this.nombresUserss.uid == undefined){
          this.rootPage = SliderPage;
        }
      });
    } else {
      this.rootPage = SliderPage;
    }


    // platform.ready().then(() => {
    //   if (localStorage.getItem("isLogin") == "true" && localStorage.getItem("reservacion") != "true") {
    //     this.fb.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
    //       const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    //       firebase.auth().signInWithCredential(facebookCredential)
    //         .then(user => {
    //           this.us = user.user;
    //           console.log('Usuario: ', JSON.stringify(this.us));
    //           localStorage.setItem("uid", this.us.uid);
    //           //cargar datos de facebook del usuario
    //           this.usuarioProv.cargarUsuario(
    //             this.us.displayName,
    //             this.us.email,
    //             this.us.photoURL,
    //             this.us.uid,
    //             'facebook'
    //           );
    //           // this.nav.setRoot(TabsPage);
    //           this.nav.setRoot(TipoLugarPage);
    //         }).catch(e => alert('Error de autenticación' + JSON.stringify(e)));
    //     })
    //   }
    //   else if (localStorage.getItem("isLogin") == "false") {
    //     this.nav.setRoot(SliderPage);
    //   }
    //   else if (localStorage.getItem("reservacion") == "true") {
    //     this.nav.setRoot(ResumenPage, {
    //       idReservacion: localStorage.getItem("idReservacion"),
    //       idSucursal: localStorage.getItem("idSucursal"),
    //       uid: localStorage.getItem("uidEvento")
    //     });
    //   }
    //   // Okay, so the platform is ready and our plugins are available.
    //   // Here you can do any higher level native things you might need.
    //   statusBar.styleDefault();
    //   splashScreen.hide();
    //   //Funcion de notificaciones para que se ejecute encuanto inicias sesion y guarde el player id en el localStorage
    //   this._providerPushNoti.init_push_noti();
    //   this.contacts.create();
    // });

    this.afs
      .collection("users")
      .valueChanges()
      .subscribe(data => {
        this.nombresUsers = data;
      });


    if (this.uidUserSesion != null || this.uidUserSesion != undefined) {
      //consultar tabla usuarios
      this.afs
        .collection("users").doc(this.uidUserSesion)
        .valueChanges()
        .subscribe(data => {
          this.nombresUserss = data;
          this.foto == 1;
          console.log(" foto es 1");
          console.log("Datos del usuario app", this.nombresUserss);

        });
    }

    if (this.uidUserSesion == null) {
      this.foto == 0;
      console.log(" foto es 0");
    }


    // if (this.uidUserSesion != null) {
    //   this.rootPage = this.home;
    // } else {
    //   this.rootPage = this.slider;
    // }



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
    localStorage.setItem("isLogin", 'false');
    this.afAuth.auth.signOut().then(res => {
      this.usuarioProv.usuario = {};
      this.rootPage = LoginPage;
      this.menuCtrl.close();
    });
  }

  irsalir() {
    localStorage.removeItem('invitado');
    localStorage.removeItem("isLogin");
    localStorage.removeItem("uid");
    this.afAuth.auth.signOut().then(res => {
      this.usuarioProv.usuario = {};
      this.nav.setRoot(LoginPage);
      this.menuCtrl.close();
    });
  }//termina constructor



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
}

