import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { TabsPage } from "../tabs/tabs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { PoliticasPage } from '../politicas/politicas';


@IonicPage()
@Component({
  selector: 'page-telefono-user',
  templateUrl: 'telefono-user.html',
})
export class TelefonoUserPage {

  //Declarar variables
  idUsuario: any;
  telefono: any;
  ciudad: any;
  myForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public usuarioProv: UsuarioProvider,
    public afDB: AngularFireDatabase,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public afs: AngularFirestore) {
    //recibe parametro del id del usuario
    this.idUsuario = this.navParams.get("idUsuario");

    //validas que los inputs del formulario no esten vacios
    this.myForm = this.fb.group({
      telefono: ["", [Validators.required]],
      ciudad: ["", [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TelefonoUserPage');
  }

  addTelefono() {
    //console.log('El ciudad llego ',this.ciudad);
    //console.log('El telefono llego ',this.inputText);
    this.usuarioProv.agregarTelefono(this.idUsuario, this.telefono, this.ciudad).then((respuesta: any) => {
      console.log("Respuesta: ", respuesta);
      if (respuesta.success == true) {
        localStorage.setItem('telefono', this.telefono);
        console.log("Success: ", respuesta.success);
      }
    });
    this.alerta();
  }

  // alerta() {
  //   const alert = this.alertCtrl.create({
  //     title: 'Términos y Condiciones',
  //     subTitle: 'Al selecionar "Continuar", aceptas los términos y condiciones de los <a>Términos de uso</a> y la <a>Política de privacidad</a> de Guest Resy',
  //     buttons: ['OK']
  //   });
  //   alert.present();

  //   this.navCtrl.setRoot(TipoLugarPage);
  // }

  alerta() {
    const confirm = this.alertCtrl.create({
      title: 'Términos y Condiciones',
      message: 'Al selecionar "Continuar", aceptas los términos y condiciones de los <a>Términos de uso</a> y la <a>Política de privacidad</a> de Guest Resy',
      buttons: [
        // {
        //   text: 'Disagree',
        //   handler: () => {
        //     console.log('Disagree clicked');
        //   }
        // },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Agree clicked');

            // this.navCtrl.setRoot(PoliticasPage);

            const variable = 'telefono';
            this.navCtrl.setRoot(PoliticasPage, { variable: variable });
          }
        }
      ]
    });
    confirm.present();
  }

}
