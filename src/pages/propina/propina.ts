import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { TabsPage } from '../tabs/tabs';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { EventosPage } from '../eventos/eventos';
import { MisReservacionesPage } from '../mis-reservaciones/mis-reservaciones';
import { DetallePropinaPage } from '../detalle-propina/detalle-propina';



@IonicPage()
@Component({
  selector: 'page-propina',
  templateUrl: 'propina.html',
})
export class PropinaPage {

  idReservacion: any;
  propina: any;
  myForm: FormGroup;
  infoReservaciones: any;
  validarCupon: any;
  total: any;
  totalPropina: any;
  totalPropina2: any;
  productos: any;
  uidUserSesion: any;
  miUser: any = {};


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public providerReserva: ReservacionProvider,
    public afs: AngularFirestore,
    public alertCtrl: AlertController,
    public platform: Platform,
    public fb: FormBuilder) {
    this.idReservacion = navParams.get("idReservacion");
    //validar que los inputs del formulario no esten vacios
    this.myForm = this.fb.group({
      propina: ["", [Validators.required]]
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PropinaPage');
  }

  propinaAdd() {

    //Guarda la propina en la reservacion indicada
    console.log('reservacion propina', this.idReservacion);
    console.log('propina', this.propina);
    this.afs.collection("reservaciones").doc(this.idReservacion).update({
      "propina": this.propina,
      "playerIDs": localStorage.getItem('playerID')
    })
      .then(function () {
        console.log("se adjunto la propina!");
      });
    //SABER SI SE USO UN cupon en la reservacion
    this.providerReserva.getInfo(this.idReservacion).subscribe(info => {
      this.infoReservaciones = info;
      if (info[0].uidCupon == undefined) {
        this.validarCupon = 'Noexiste';
        // total de general dependiendo los productos que tenga la reservacion
        this.providerReserva.getProductos(this.idReservacion).subscribe(productos => {
          this.productos = productos;
          this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);
          const propinaCalculo = this.total * this.propina;
          this.totalPropina = this.total + propinaCalculo;
          //this.navCtrl.setRoot(DetallePropinaPage, {
          //  totalPropina: this.totalPropina,
          //});
          //Manda mensaje de termino de la reservacion
          //let alertMesas = this.alertCtrl.create({
          //  message:
          //    "Total de la reservacion con propina es: $ " + this.totalPropina + " Gracias por reservar en Guest Resy te notificaremos cuando tu reservación haya sido aceptada.",
          //  buttons: [
          //    {
          //      text: "Aceptar",
          //      handler: () => {
          //        console.log("Buy clicked");
          //        this.navCtrl.setRoot(MisReservacionesPage);
          //      }
          //    }
          //  ]
          //});
          //alertMesas.present();
        });
      } else {
        this.validarCupon = 'Existe';
        const totalDescuento = info[0].totalReservacion;
        const propinaCalculo2 = totalDescuento * this.propina;
        this.totalPropina2 = totalDescuento + propinaCalculo2;
      //  this.navCtrl.setRoot(DetallePropinaPage, {
        //  totalPropina: this.totalPropina2,
        //});
        //Manda mensaje de termino de la reservacion
        //let alertMesas2 = this.alertCtrl.create({
        //  message:
        //    "Total de la reservacion con propina es: $ " + this.totalPropina2 + " Gracias por reservar en Guest Resy te notificaremos cuando tu reservación haya sido aceptada.",
        //  buttons: [
        //    {
        //      text: "Aceptar",
        //      handler: () => {
        //        console.log("Buy clicked");
        //        this.navCtrl.setRoot(MisReservacionesPage);
        //      }
        //    }
        //  ]
        //});
        //alertMesas2.present();
      }

    });
    this.navCtrl.setRoot(MisReservacionesPage);
    this.getUsersPusCancelar();
  }



  getUsersPusCancelar() {

    const playerID = localStorage.getItem('playerID');

    console.log("my PlayerID: ", playerID);
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
        include_player_ids: [playerID],
        data: { foo: "bar" },
        contents: {
          en: "Nueva Reservación"
        }
      };

      window["plugins"].OneSignal.postNotification(
        noti,
        function (successResponse) {
          console.log(
            "Notification Post Success:",
            successResponse
          );
        },
        function (failedResponse: any) {
          console.log("Notification Post Failed: ", failedResponse);
        }
      );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }
}
