import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from "../login/login";


import { UsuarioProvider, Credenciales } from "../../providers/usuario/usuario";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { PerfilEditarPage } from '../perfil-editar/perfil-editar';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  // user: Credenciales = {};
  nombresUsers: any;
  tarjetasData: any;
  uidUserSesion: any;
  miUser: any = {};
  user: any = {};
  misTarjetas: any;
  numTarjetas: any;
  nombresUserss: any = {};

  imagenPreview : string ="";
  imagen64: string;
  mes: any;
  invitado: any;


  constructor(public navCtrl: NavController,
    public usuarioProv: UsuarioProvider,
    private afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    private camera: Camera,
    public toastCtrl: ToastController,
    public afs: AngularFirestore) {

    // console.log(this.usuarioProv.usuario);
    // this.user = this.usuarioProv.usuario;

    // this.afAuth.authState.subscribe(user => {
    //   console.log('AFAUTH!!');
    //   console.log(JSON.stringify(user));
    // });

    this.uidUserSesion = localStorage.getItem('uid');
    this.invitado = localStorage.getItem('invitado');
    console.log('id del usuario en localStorage', this.uidUserSesion);

    this.afs
      .collection("users").doc(this.uidUserSesion)
      .valueChanges()
      .subscribe(dataSu => {
        this.user = dataSu;
        console.log('Datos de mi usuario', this.user);
      });

    //consultar tabla usuarios
    this.afs
      .collection("users")
      .valueChanges()
      .subscribe(data => {
        this.nombresUsers = data;
      });

    //consultar tabla tarjetas
    this.afs
      .collection("tarjetas")
      .valueChanges()
      .subscribe(datat => {
        this.tarjetasData = datat;
      });

    //sacar el id del usuario del local storage
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

    this.afs
      .collection("users").doc(this.uidUserSesion)
      .valueChanges()
      .subscribe(data => {
        this.nombresUserss = data;
      });


    this.getAllTarjetas();
  }

  salir() {
    localStorage.setItem("isLogin", 'false');
    this.afAuth.auth.signOut().then(res => {
      this.usuarioProv.usuario = {};
      this.navCtrl.setRoot(LoginPage);
    });
  }


  getAllTarjetas() {
    //console.log('miuser',this.uid);
    this.usuarioProv.getTarjetasUser(this.uidUserSesion).subscribe(tarjeta => {
      this.misTarjetas = tarjeta;
      this.numTarjetas = this.misTarjetas.length;
      console.log('misTarjetas', this.numTarjetas);
      //this.tarjetaAnterior = localStorage.getItem('TarjetaId');
      //console.log('misTarjetas',this.misTarjetas);
    });
  }


  mostrar_camara() {

    this.msg();

    const options: CameraOptions = {
      quality: 85,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: 2,
      saveToPhotoAlbum: false,
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = imageData;

      console.log("Este es mi imagen", this.imagenPreview);
      

      this.afs.collection('users').doc(this.uidUserSesion).update({
        photoURL: this.imagenPreview
      }).then(() => {
        console.log("Se actualizo la suscripcion");

        this.afs.collection('users').doc(this.uidUserSesion).update({
          status_foto: 1
        }).then(() => {
          console.log("Se actualizo la suscripcion");
        });
        
      });

      this.mostrar_toast('Archivo subido con exito');

     }, (err) => {
      // Handle error
      console.log("Error en Camara", JSON.stringify(err));
     });

  }


  msg(){
    this.toastCtrl.create({
      message: 'mostrar camara',
      duration: 2000
    }).present();
  }


  mostrar_toast(mensaje: string) {

    this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    }).present();

  }

  goInicio(){
    this.navCtrl.setRoot(TipoLugarPage);
  }
  editarPerfil(){
    console.log('editar perfil');
    this.navCtrl.setRoot(PerfilEditarPage);
  }


}
