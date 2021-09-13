import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';

/**
 * Generated class for the LoginTelDatosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-tel-datos',
  templateUrl: 'login-tel-datos.html',
})
export class LoginTelDatosPage {

  numero: any;
  us: any;
  myForm: FormGroup;
  usersPhone: any;
  zonas: any;

  constructor(public usuariosP: UsuarioProvider, public navCtrl: NavController, public navParams: NavParams, public fbr: FormBuilder, private afAuth: AngularFireAuth, public alertCtrl: AlertController) {
  
    this.myForm = this.fbr.group({
      numero: ['', [Validators.required]]
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginTelDatosPage');
  }

  LoginNumPhone() {
    console.log('login numero');
    let num = "+"+this.numero;
    let uid = '';
     try {
        this.usuariosP.getUsuarioID(num).subscribe(co => {
          console.log("data", co);
          this.usersPhone = co;
          
          if(this.usersPhone != ''){
            uid = this.usersPhone[0].uid;
            console.log(uid);
            localStorage.setItem('uid', uid);
            localStorage.setItem('isLogin', 'true');
            this.navCtrl.setRoot(TipoLugarPage);
          }
          

        });
        
    } catch (error) {
      const alert = this.alertCtrl.create({
        title: 'Usuario',
        subTitle: 'Numero no valido',
        buttons: ['Aceptar']
      });
      alert.present();
    }
    
  }
   
  goBack(){
    this.navCtrl.setRoot(LoginPage);
  }

}
