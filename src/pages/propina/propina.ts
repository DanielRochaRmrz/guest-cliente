import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from '@angular/fire/firestore';
import { TabsPage } from '../tabs/tabs';
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { EventosPage } from '../eventos/eventos';
import { MisReservacionesPage } from '../mis-reservaciones/mis-reservaciones';
import { DetallePropinaPage } from '../detalle-propina/detalle-propina';
import * as firebase from "firebase";
import { ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-propina',
  templateUrl: 'propina.html',
})
export class PropinaPage {
  db = firebase.firestore();
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
  codigoRp: any;
  codigoRpUsers: any;

  // DATOS PARA TABLA DE CONTCODIGOSRP

  uid: any = {};
  uidUser: any;
  uidRP: any;
  fecha: any;
  codigoRpUser: any;
  nombreUsuario: any;

  rowConCode: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public providerReserva: ReservacionProvider,
    public afs: AngularFirestore,
    public alertCtrl: AlertController,
    public platform: Platform,
    public fb: FormBuilder,
    public toastCtrl: ToastController) {
    this.idReservacion = navParams.get("idReservacion");
    //validar que los inputs del formulario no esten vacios
    this.myForm = this.fb.group({
      propina: ["", [Validators.required]],
      codigoRp: ["", [Validators.required]]
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

        this.nombreUsuario = this.miUser.displayName;

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PropinaPage');
  }

  propinaAdd() {

    //Guarda la propina en la reservacion indicada
    console.log('reservacion propina', this.idReservacion);
    console.log('propina', this.propina);
    // console.log('codigoRP', this.codigoRp);

    if(this.codigoRp != ""){

      const codigoRpUser = this.codigoRp; 

      // VERIFICA SI EL CODIGO INGRESADO POR EL USUARIO EXISTE EN LA BASE DE DATOS

    const consul = this.afs.collection('codigosRp').ref; 
    consul.where('codigo', '==', codigoRpUser).get().then(data =>{

        this.codigoRpUsers = data;

        console.log("CODIGO RP", this.codigoRpUsers);    

        this.codigoRpUsers.forEach(element => {

          const elem = element.data()

          const codigoRP = elem.codigo;
          const uidRp = elem.uidRp;
          
          if(codigoRP.length != 0){

            // SI EL CODIGO YA FUE USADO POR EL USUARIO 

            console.log("USERSESSION", this.uidUserSesion);
            console.log("uid", codigoRP);
            console.log("uidRp", uidRp);   
            console.log("NOMBRE USUARIO", this.nombreUsuario);
                     
            
            const consul2 = this.afs.collection('contCodigosRp').ref;
            consul2.where('codigoRpUser', '==', codigoRP).where('uidRP', '==', uidRp).where('uidUser', '==', this.uidUserSesion).get().then(data =>{

              

              this.rowConCode = data.empty;

              console.log("conCodigosRp", this.rowConCode);              

              // console.log("ROWCONCODE", this.rowConCode);
              
              // console.log("lenght rowconcode",this.rowConCode.length);  
                if(this.rowConCode == true){                  

                  // let result = '';
                  // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                  // const charactersLength = characters.length;
                  // for (let i = 40; i < charactersLength; i++) {
                  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
                  // }
        
                  // this.uid = result;

                  let today = Date.now();

                  this.afs.collection("contCodigosRp").doc(this.idReservacion).set({

                    estatus: 0,
                    uid: this.idReservacion,
                    uidUser: this.uidUserSesion,
                    nombreUsuario: this.nombreUsuario,
                    uidRP: uidRp,
                    fecha: today,
                    codigoRpUser: codigoRP,
                    uidReservacion: this.idReservacion
      
                  });

                  // INICIA FLUJO NORMAL DEL PROCESO DE RESERVACION 

                  this.afs.collection("reservaciones").doc(this.idReservacion).update({
                    "propina": this.propina,
                    "codigoRP": codigoRP,
                    "estatusFinal": "rsv_copletada",
                    "playerIDs": localStorage.getItem('playerID'),
                  })
                    .then(function () {
                      console.log("se adjunto la propina!");
                    });
                    if(localStorage.getItem('compartida')){
              
                      this.db.collection("compartidas").where("idReservacion", "==", this.idReservacion)
                          .get().then((data) => {
                            data.forEach((doc) => {
                              console.log(doc.data());
                              const compartidas = doc.data();
                              const idCompartidas = compartidas.idCompartir;
                              if (idCompartidas) {
                               this.db.collection('compartidas').doc(idCompartidas).update({
                                "estatusFinal": "rsv_copletada"
                               }).then(() => console.log('Comaprtidas actulizadas'))
                              } else {
                                console.log('No hay');
                              }
                            });
                          });
                      
                    }
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

                  // TERMINA FLUJO NORMAL DEL PROCESO DE RESERVACION 

                }

            });

            // TERMINA SI EL CODIGO YA FUE USADO POR EL USUARIO            

          }
          
        });
        if(this.codigoRpUsers.empty == true){

          this.mostrar_toast('EL CÓDIGO QUE INGRESASTE NO COINCIDE CON NUESTROS REGISTROS');  
          // console.log("NO HAY COINCIDENCIAS");                   

        }else if(this.codigoRpUsers.empty == false){

          this.mostrar_toast('EL CÓDIGO QUE INGRESASTE YA LO HAS UTILIZADO');

        }
      });

    // EN CASO DE QUE NO UTILIZEN CODIGO DE RP 

    }else if(this.codigoRp == ""){

      this.afs.collection("reservaciones").doc(this.idReservacion).update({
        "propina": this.propina,
        "estatusFinal": "rsv_copletada",
        "playerIDs": localStorage.getItem('playerID'),
      })
        .then(function () {
          console.log("se adjunto la propina!");
        });
        if(localStorage.getItem('compartida')){
  
          this.db.collection("compartidas").where("idReservacion", "==", this.idReservacion)
              .get().then((data) => {
                data.forEach((doc) => {
                  console.log(doc.data());
                  const compartidas = doc.data();
                  const idCompartidas = compartidas.idCompartir;
                  if (idCompartidas) {
                   this.db.collection('compartidas').doc(idCompartidas).update({
                    "estatusFinal": "rsv_copletada"
                   }).then(() => console.log('Comaprtidas actulizadas'))
                  } else {
                    console.log('No hay');
                  }
                });
              });
          
        }
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

      // window["plugins"].OneSignal.postNotification(
      //   noti,
      //   function (successResponse) {
      //     console.log(
      //       "Notification Post Success:",
      //       successResponse
      //     );
      //   },
      //   function (failedResponse: any) {
      //     console.log("Notification Post Failed: ", failedResponse);
      //   }
      // );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }
  
  mostrar_toast( mensaje: string  ){

    const toast = this.toastCtrl.create({
       message: mensaje,
       duration: 3000
     }).present();
   }
}
