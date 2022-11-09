import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
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
  respuestaestadoEmailVerificado: any;
  usuarioLog: any;

  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    public usuarioProv: UsuarioProvider,
    public fbr: FormBuilder,
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public loadCtrl: LoadingController
  ) {

    this.myForm = this.fbr.group({
      email: ['', [Validators.required]],
      pass: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });

    this.myForm_lo = this.fbr.group({
      email_lo: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      pass_lo: ['', [Validators.required]]
    });

    this.myFormr = this.fbr.group({
      email_re: ['', [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginCorreoPage');

    this.palabra = this.navParams.get('palabra');

  }

  goBack() {
    this.navCtrl.setRoot(LoginPage);
  }

  RegisterToEmail() {

    const laoding = this.loadCtrl.create({
      content: "Espera un momento...",
      spinner: "bubbles"
    });

    laoding.present();

    const email = this.email.trim();

    // CREANDO PERFIL EN FIREBASE

    this.afAuth.auth.createUserWithEmailAndPassword(email, this.pass).then((user: any) => {

      this.us = user.user;

      // AGREGANDO REGISTRO EN BD

      this.db.collection('users').doc(this.us.uid).set({
        uid: this.us.uid,
        displayName: this.name,
        email: this.us.email,
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/guestreservation-8b24b.appspot.com/o/users.png?alt=media&token=42d160e1-4f6e-4d65-84d6-ef4ed3a8c057',
        playerID: localStorage.getItem('playerID'),
        phoneNumber: 'null',
        instagram: 'null',
        status_foto: 0,
        provider: 'google',
        type: 'u',
        ciudad: 'null'
      }).then(() => {

        // ENVIO DE CORREO DE VERFICACION

        var userEmail = firebase.auth().currentUser;

        userEmail.sendEmailVerification().then(() => {
          const alert = this.alertCtrl.create({
            title: 'Verifica tu correo',
            message: 'Se ha enviado un mensaje a tu correo electrónico para verificar tu cuenta, por favor checa tu email, sino esta en tu bandeja de entrada dirigete al SPAM.',
            buttons: ['Aceptar']
          });
          alert.present();

          this.afAuth.auth.signOut();

          this.navCtrl.setRoot(LoginPage);

          // setTimeout(() => {
            laoding.dismiss();
          // }, 3000 );

        }).catch(function (error) {

          console.log(error);

        });
      })

      // CONTROL DE ERROR DE CORREO REPETIDO

    }).catch(function (error) {

      alert(error);

    });
  }

  LoginToEmail() {

    try {

      const result = this.afAuth.auth.signInWithEmailAndPassword(this.email_lo, this.pass_lo).then((user: any) => {

        this.respuestaestadoEmailVerificado = user.user.emailVerified;

        if (result) {

          if (this.respuestaestadoEmailVerificado == true) {

            var uid = user.user.uid;

            this.usuarioProv.getCodigo(uid).subscribe(userLog => {

              this.usuarioLog = userLog;

              console.log("usuario log", this.usuarioLog);

              this.usuarioLog.forEach(data => {

                var phoneNumber = data.phoneNumber;

                if (phoneNumber == "null") {

                  const alert = this.alertCtrl.create({
                    title: '¡Captura de datos!',
                    message: 'Aún nos falta conocerta más, por favor llena el siguiente formulario.',
                    buttons: ['Aceptar']
                  });

                  alert.present();

                  this.navCtrl.setRoot(TelefonoUserPage, {

                    idUsuario: data.uid

                  });

                } else {

                  this.us = result;

                  localStorage.setItem("isLogin", 'true');

                  localStorage.setItem("uid", user.user.uid);

                  this.navCtrl.setRoot(TipoLugarPage, { 'uid': user.user.uid });

                }

              });
            });


          } else {

            const alert = this.alertCtrl.create({
              title: 'Email no verificado',
              message: 'Revisa la bandeja de entrada o el spam de tu correo electrónico para verificar tu email y poder acceder.',
              buttons: ['Aceptar']
            });

            alert.present();

          }

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

  goToUserExist() {
    this.db.collection("users").doc(this.uidUserSesion).valueChanges().subscribe(data => {
      this.nombresUserss = data;
      console.log("dato usuario existente", this.nombresUserss);

      if (this.nombresUserss.uid != null || this.nombresUserss.uid == undefined) {
        if (this.nombresUserss.type == 'u') {
          this.navCtrl.setRoot(TipoLugarPage, { 'uid': this.nombresUserss.uid });
        }
      }
    });
  }




}
