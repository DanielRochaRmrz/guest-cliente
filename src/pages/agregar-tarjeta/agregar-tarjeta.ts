import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TarjetasPage } from "../../pages/tarjetas/tarjetas";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { AngularFirestore } from "@angular/fire/firestore";
import { TipoLugarPage } from "../tipo-lugar/tipo-lugar";
import * as CryptoJS from "crypto-js";

@IonicPage()
@Component({
  selector: "page-agregar-tarjeta",
  templateUrl: "agregar-tarjeta.html",
})
export class AgregarTarjetaPage {
  fechaActual: any;
  fechaActualanio: any;
  myForm: FormGroup;
  request: string;
  numTarjeta: any;
  numTarjeta4dijitos: any;
  mesExp: any;
  anioExp: any;
  uid: any;
  miUser: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public afs: AngularFirestore,
    public usuarioProv: UsuarioProvider
  ) {
    //validas que los inputs del formulario no esten vacios
    this.myForm = this.fb.group({
      numTarjeta: ["", [Validators.required]],
      mesExp: ["", [Validators.required]],
      anioExp: ["", [Validators.required]],
    });
    //sacar el id del usuario del localstorage
    this.uid = localStorage.getItem("uid");

    this.afs
      .collection("users")
      .doc(this.uid)
      .valueChanges()
      .subscribe((dataSu) => {
        this.miUser = dataSu;
        console.log("Datos de mi usuario", this.miUser);
      });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AgregarTarjetaPage");
    this.fechaActual = new Date().toJSON().split("T")[0];
    //console.log('fecha actual',this.fechaActual);
    this.fechaActualanio = this.fechaActual.substr(0, 4);
    //console.log('fecha actual año',this.fechaActualanio);
  }

  //agregar los datos de la tarjeta
  tarjetaAdd() {
    let numTarjeta = CryptoJS.AES.encrypt(this.numTarjeta, '#C4rdGu35t').toString();
    let mesExp = CryptoJS.AES.encrypt(this.mesExp, '#C4rdGu35t').toString();
    let anioExp = CryptoJS.AES.encrypt(this.anioExp, '#C4rdGu35t').toString();
    this.numTarjeta4dijitos = this.numTarjeta.substr(-4);

    this.usuarioProv
      .agregarTarjeta(
        this.uid,
        numTarjeta,
        anioExp,
        mesExp,
        this.numTarjeta4dijitos
      )
      .then((respuesta: any) => {
        console.log("Respuesta: ", respuesta);
        if (respuesta.success == true) {
          console.log("Success: ", respuesta.success);
        }
      });
    this.navCtrl.push(TarjetasPage);
    this.navCtrl.setRoot(TarjetasPage);
  }

  goBack() {
    this.navCtrl.setRoot(TarjetasPage);
  }

  goInicio() {
    this.navCtrl.setRoot(TipoLugarPage);
  }

  behind() {
    this.navCtrl.setRoot(TarjetasPage);
  }
}
