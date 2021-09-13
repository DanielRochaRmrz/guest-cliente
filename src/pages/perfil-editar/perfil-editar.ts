import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PerfilPage } from '../perfil/perfil';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from "@angular/fire/firestore";
import { UsuarioProvider } from '../../providers/usuario/usuario';
/**
 * Generated class for the PerfilEditarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil-editar',
  templateUrl: 'perfil-editar.html',
})
export class PerfilEditarPage {

  myForm: FormGroup;
  numero: any='';
  nombre: any='';
  correo: any='';
  telefono: any='';
  tarjeta: any='';
  uid: any;
  miUser: any;
  id: any;

  constructor(public navParams: NavParams, public navCtrl: NavController, public fbr: FormBuilder, public afs: AngularFirestore, public userioP: UsuarioProvider) {

    this.uid=localStorage.getItem('uid');
    console.log('UID:', this.uid);

    this.getUser(this.uid);
    this.myForm = this.fbr.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      tarjeta: ['', [Validators.required]]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilEditarPage');
  }

  goBack(){
    this.navCtrl.setRoot(PerfilPage);
  }

  editar(id) {
    console.log('editar datos', id);
    let info = {
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono,
      tarjeta: this.tarjeta
    };

     this.userioP.updatePerfil(id, info).then((respuesta: any) => {
        
        if (respuesta.success == true) {
          this.navCtrl.push(PerfilPage, {
            //enviar parametros a vista
            // idReservacion: this.idReservacion,
            // uid: this.evento,
    
          });
        } else {
        }

       })
       .catch();
  }


  getUser(uid) {

    //sacar el id del usuario del local storage
    
    console.log('id del usuario en eventos', uid);

    //obtener informacion de mi user
    this.afs
      .collection("users").doc(uid)
      .valueChanges()
      .subscribe(dataSu => {
        this.miUser = dataSu;
        console.log('Datos de mi usuario', this.miUser.phoneNumber);
        this.telefono=this.miUser.phoneNumber;
        this.nombre =this.miUser.displayName;
        this.correo = this.miUser.email;
        this.tarjeta = this.miUser.tarjeta;
        this.id = this.miUser.uid;
      });

  }



}
