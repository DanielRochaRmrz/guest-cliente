import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { TelefonoUserPage } from '../telefono-user/telefono-user';
import * as firebase from 'firebase';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';


@IonicPage()
@Component({
  selector: 'page-login-correo',
  templateUrl: 'login-correo.html',
})
export class LoginCorreoPage {

  palabra: any;
  pass: any;
  email: any;
  name: any;
  email_lo: any;
  pass_lo: any;
  email_re: any;
  us: any;
  codigos: any;
  telefono: any;
  myForm: FormGroup;
  myForm_lo: FormGroup;
  myFormr: FormGroup;
  afs = firebase.firestore();
  uidUserSesion: any;
  nombresUserss: any = {};

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

    constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    public usuarioProv: UsuarioProvider,
    public fbr: FormBuilder,
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams) {

    this.myForm = this.fbr.group({
      email: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });

    this.myForm_lo = this.fbr.group({
      email_lo: ['', [Validators.required, Validators.pattern( this.emailPattern )]],
      pass_lo: ['', [Validators.required]]
    });

    this.myFormr = this.fbr.group({
      email_re: ['', [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginCorreoPage');
  
    this.palabra = this.navParams.get('palabra');
    console.log("Dato", this.palabra);

    this.uidUserSesion = localStorage.getItem('uid');
    console.log('id del usuario en localStorage', this.uidUserSesion);

    if(this.palabra == 'inicio_sesion'){
      if (this.uidUserSesion != null || this.uidUserSesion != undefined) {
        this.goToUserExist();
      }
    }

  }

  goBack() {
    this.navCtrl.setRoot(LoginPage);
  }

  RegisterToEmail() {

    console.log("nombre", this.name, "correo", this.email, "password", this.pass);

    const email = this.email.trim();
    console.log('Email con espacio', this.email);
    console.log('Email sin espacio', email);
    
    const result = this.afAuth.auth.createUserWithEmailAndPassword(email, this.pass).then((user: any) => {
      console.log('usuario', user);

      localStorage.setItem("isLogin", 'true');
      this.us = user.user;
      console.log('Usuario: ', JSON.stringify(this.us));
      console.log("contraseña", this.us.pass);
      localStorage.setItem("uid", this.us.uid);

      this.usuarioProv.getCodigo(this.us.uid).subscribe(co => {
        this.codigos = co;
        console.log('datos tabla user', this.codigos.length);
        if (this.codigos.length == 0) {
          console.log('agregar tel');

          this.db.collection("users").doc(this.us.uid).set({
            uid: this.us.uid,
            displayName: this.name,
            email: this.us.email,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/guestreservation-8b24b.appspot.com/o/users.png?alt=media&token=42d160e1-4f6e-4d65-84d6-ef4ed3a8c057',
            playerID: localStorage.getItem('playerID'),
            phoneNumber: 'null',
            status_foto: 0,
            provider: 'google',
            type: 'u',
            ciudad: 'null',
            tarjeta: ''
          });
          this.navCtrl.setRoot(TelefonoUserPage, {
            idUsuario: this.us.uid
          });

        }
        this.codigos.forEach(data => {
          console.log('telefonoforeach', data.phoneNumber);
          this.telefono = data.phoneNumber;
          //console.log('telefono',data.phoneNumber);
          if (data.phoneNumber == 'null' || data.phoneNumber == undefined || data.phoneNumber == null) {
            console.log('No existe telefono manda a telefono');
            console.log('telefonoif', data.phoneNumber);
            this.db.collection('users').doc(this.usuarioProv.usuario.uid).set({
              uid: this.usuarioProv.usuario.uid,
              displayName: this.us.displayName,
              email: this.us.email,
              photoURL: 'https://firebasestorage.googleapis.com/v0/b/guestreservation-8b24b.appspot.com/o/users.png?alt=media&token=42d160e1-4f6e-4d65-84d6-ef4ed3a8c057',
              playerID: localStorage.getItem('playerID'),
              phoneNumber: 'null',
              status_foto: 0,
              provider: 'google',
              type: 'u',
              ciudad: 'null'
            });
            this.navCtrl.setRoot(TelefonoUserPage, {
              idUsuario: this.us.uid
            });
          } else {
            console.log('Ya existe telefono manda a tabs');
            console.log('telefonoelse', data.phoneNumber);
            localStorage.setItem('telefono', data.phoneNumber);
            this.db.collection('users').doc(this.usuarioProv.usuario.uid).set({
              uid: this.usuarioProv.usuario.uid,
              displayName: this.us.displayName,
              email: this.us.email,
              photoURL: 'https://firebasestorage.googleapis.com/v0/b/guestreservation-8b24b.appspot.com/o/users.png?alt=media&token=42d160e1-4f6e-4d65-84d6-ef4ed3a8c057',
              playerID: localStorage.getItem('playerID'),
              phoneNumber: data.phoneNumber,
              status_foto: 0,
              provider: 'google',
              type: 'u',
              ciudad: data.ciudad
            });
          }
        });
      });
    });
  }

  LoginToEmail() {

    try {



      const result = this.afAuth.auth.signInWithEmailAndPassword(this.email_lo, this.pass_lo).then((user: any) => {
        console.log('Result -->', user);
        localStorage.setItem("isLogin", 'true');
        if (result) {
          this.us = result;
          localStorage.setItem("uid", user.user.uid);
          this.navCtrl.setRoot(TipoLugarPage, { 'uid': user.user.uid });
        }
      }).catch(error => {
        if (error.code == "auth/invalid-email") {
          const alert = this.alertCtrl.create({
            title: 'Correo',
            message: 'Formato de correo invalido',
            buttons: ['Aceptar']
          });
          alert.present(); 
        } 

        if (error.code == "auth/wrong-password") {
          const alert = this.alertCtrl.create({
            title: 'Contraseña',
            message: 'Contraseña incorrecta',
            buttons: ['Aceptar']
          });
          alert.present(); 
        } 

        if (error.code == "auth/user-not-found") {
          const alert = this.alertCtrl.create({
            title: 'Usuario',
            message: 'No existe registro del usuario, por favor registrate para poder acceder',
            buttons: ['Aceptar']
          });
          alert.present(); 
        } 
        
      });
    } catch (error) {
      if (error.code == "auth/argument-error") {
        const alert = this.alertCtrl.create({
          title: 'Campos',
          message: 'Correo y contraseña son campos requeridos',
          buttons: ['Aceptar']
        });
        alert.present();
      } 
    }

  }

  onReset(position: string) {
    console.log("llega");
    console.log("este es el correo", this.email);

    var auth = firebase.auth();

    auth.sendPasswordResetEmail(this.email).then(function () {

      this.flashMessage.show('Se ha enviado un mensaje a tu correo', { cssClass: 'alert-success', timeout: 4000 });

      // this.router.navigate(['login']);

    }).catch(function (error) {
    });

    let toast = this.toastCtrl.create({
      message: 'Se ha enviado un mensaje a tu correo',
      duration: 4000,
      position: position
    });

    toast.present(toast);

    this.navCtrl.setRoot(LoginCorreoPage);
  }

  goToUserExist(){
    this.db.collection("users").doc(this.uidUserSesion).valueChanges().subscribe(data => {
        this.nombresUserss = data;
        console.log("dato usuario existente", this.nombresUserss);
        
        if(this.nombresUserss.uid != null || this.nombresUserss.uid == undefined){
          if(this.nombresUserss.type == 'u'){
            this.navCtrl.setRoot(TipoLugarPage, { 'uid': this.nombresUserss.uid });
          }
        }
    });
  }




}
