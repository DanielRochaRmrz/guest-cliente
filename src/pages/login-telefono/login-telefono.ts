import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';


@IonicPage()
@Component({
  selector: 'page-login-telefono',
  templateUrl: 'login-telefono.html',
})
export class LoginTelefonoPage {

  recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  confirtmacion:any;
  inputCode: boolean = false;
  code: any = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginTelefonoPage');
  }

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  signIn(phoneNumber: number, ciudad: any){
    
    
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( async (confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        
        let prompt = await this.alertCtrl.create({
        title: 'Ingresa el código',
        inputs: [{ name: 'confirmationCode', placeholder: 'Confirmación del código' }],
        buttons: [
          { text: 'Cancelar',
            handler: data => { console.log('Cancel clicked'); }
          },
          { text: 'Enviar',
            handler: data => {
              console.log("Data -->", data);
              
              confirmationResult.confirm(data.confirmationCode)
              .then((result) => {
                // User signed in successfully.
                console.log(result.user);
                console.log('ciudadSing', ciudad);
                localStorage.setItem("ciudad", ciudad);
                localStorage.setItem("registroPhone", '1');
                localStorage.setItem("isLogin", 'true');
                localStorage.setItem("prueba", "dani");  
                localStorage.setItem("uid", result.user.uid);  
                this.navCtrl.setRoot(TipoLugarPage);            
              }).catch((error) => {
    
              });
            }
          }
        ]
      });
      await prompt.present();   
  
    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });
  }
  
  
  
  goBack() {
    this.navCtrl.setRoot(LoginPage);
  }

}
