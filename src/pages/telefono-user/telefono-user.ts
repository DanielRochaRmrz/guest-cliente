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
  instagram: any;
  myForm: FormGroup;
  ciudades: any;

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
      ciudad: ["", [Validators.required]],
      instagram: ["", [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TelefonoUserPage');
    this.getCiudades();
  }

  async addTelefono() {
    const response = await this.usuarioProv.buscarTelefono(this.telefono);
    console.log('Respuesta -->', response);
    if (response == false) {
      const alert = this.alertCtrl.create({
        title: 'Teléfono',
        message: 'Este número ya se encuentra registrado',
        buttons: ['Aceptar']
      });
      alert.present();
      return;
    }

    this.usuarioProv.agregarTelefono(this.idUsuario, this.telefono, this.ciudad, this.instagram).then((respuesta: any) => {
      console.log("Respuesta: ", respuesta);
      if (respuesta.success == true) {
        localStorage.setItem('telefono', this.telefono);
        console.log("Success: ", respuesta.success);
      }
    });
    this.alerta();
  }


  getCiudades() {
    this.afs
      .collection("ciudades")
      .valueChanges()
      .subscribe(dataCiudad => {
        this.ciudades = dataCiudad;
        console.log('cudades', this.ciudades);
      });
  }

  alerta() {
    const confirm = this.alertCtrl.create({
      title: 'Términos y Condiciones',
      message: 'Al selecionar "Continuar", aceptas los términos y condiciones de los <a>Términos de uso</a> y la <a>Política de privacidad</a> de Guest Resy',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Agree clicked');
            const variable = 'telefono';
            this.navCtrl.setRoot(PoliticasPage, { variable: variable });
          }
        }
      ]
    });
    confirm.present();
  }

}
