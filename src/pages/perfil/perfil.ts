import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from "../login/login";


import { UsuarioProvider, Credenciales } from "../../providers/usuario/usuario";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { PerfilEditarPage } from '../perfil-editar/perfil-editar';
import * as firebase from 'firebase';
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
  loading : any;
  loadingC: any;


  constructor(public navCtrl: NavController,
    public usuarioProv: UsuarioProvider,
    private afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    private camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public afs: AngularFirestore
    ) {

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
    this.usuarioProv.getTarjetasUser(this.uidUserSesion).subscribe(tarjeta => {
      this.misTarjetas = tarjeta;
      this.numTarjetas = this.misTarjetas.length;
      console.log('misTarjetas', this.numTarjetas);
    });
  }

  loadinCamara() {
    this.loadingC = this.loadingCtrl.create({
      spinner: "bubbles"
    });
    this.loadingC.present();
    setTimeout(() => {
      this.mostrar_camara();
    }, 5000);
  }

  loadinCamar() {
    this.loading = this.loadingCtrl.create({
      spinner: "bubbles"
    });
    this.loading.present();
  }

  mostrar_camara() {

    
    this.loadingC.dismiss();

    const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = imageData.replace(/\s/g, '');

      console.log("Este es mi imagen", this.imagenPreview);

      this.mostrar_toast('Cargando...');

      let storeRef = firebase.storage().ref();
      let nombreArchivo:string = new Date().valueOf().toString(); // 1231231231
      this.loadinCamar();
      let uploadTask: firebase.storage.UploadTask =
          storeRef.child(`img/${ nombreArchivo }`)
                  .putString( this.imagen64, 'base64', { contentType: 'image/jpeg' }  );

         uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{ }, // saber el % de cuantos Mbs se han subido
            ( error ) =>{
              // manejo de error
              console.log("ERROR EN LA CARGA");
              console.log(JSON.stringify( error ));
              this.mostrar_toast(JSON.stringify( error ));
            },
            ()=>{
              // TODO BIEN!
              uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                firebase.firestore().collection('users').doc(this.uidUserSesion).update({
                  photoURL: downloadURL,
                  status_foto: 1
                }).then(() => {
                  this.loading.dismiss();
                  console.log("Se actualizo la suscripcion");
                }).catch((err) => console.log("Error en al subir", JSON.stringify(err)));

                this.mostrar_toast('Imagen cargada correctamente');
              });
              
            }

          )

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
