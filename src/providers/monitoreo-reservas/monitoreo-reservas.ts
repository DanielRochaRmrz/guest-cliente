import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase/app";
import 'firebase/firestore'; 
import { Stripe } from "@ionic-native/stripe";
import { LoadingController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ReservacionProvider } from '../reservacion/reservacion';
import { DeviceProvider } from '../device/device';

@Injectable()
export class MonitoreoReservasProvider {
  db = firebase.firestore();

  constructor(
    public afs: AngularFirestore,
    public stripe: Stripe,
    public loadinCtl: LoadingController,
    public http: Http,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public platform: Platform,
    public _providerReserva: ReservacionProvider,
    public _deviceProvider: DeviceProvider
    ) {
    console.log('Hello MonitoreoReservasProvider Provider');
  }
  getReservaciones(idSucursal: string) {
    // this.afs.collection('reservaciones', ref => ref.where('idSucursal', '==', idSucursal)
    return new Promise((resolve, reject) => {
      this.db
        .collection('reservaciones')
        .where("idSucursal", "==", idSucursal)
        .where("estatus", '==', 'Aceptado')
        .orderBy('fechaR_', "asc")
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
  getAllClientes(collection: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(collection)
        .where("type", "==", "u")
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            // console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getMisreservaciones(idUsuario: string) {

    return new Promise((resolve, reject) => {
      this.db
        .collection('reservaciones')
        .orderBy('fechaR_', "asc")
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(function(doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            console.log(obj);
            arr.push(obj);
          });

          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  //hacer el pago en stripe de una cuenta compartida
  cambiaPagando(uidRerservacion,numTarjeta,mesExpiracion,anioExpiracion,cvc,montoReservacion,idCompartir,folio, displayNames) {
    console.log('llegaron a pagar',uidRerservacion,numTarjeta,mesExpiracion,anioExpiracion,cvc,montoReservacion,idCompartir);
    // Poppup de carga para procesar el metodo
    let loading = this.loadinCtl.create({
    spinner: "bubbles",
    content: "Procesando pago."
    });//
    loading.present();
    // this.stripe.setPublishableKey('pk_live_51HEdzULvQxsl1JSFvSiy3nGqXSlqQc3lUzKCJWY4ve3YeDyZe3zGAt86GRQjIhof7g38oZNCp5eLxMKbyoP42AWt00yfF5wUz0');
    this.stripe.setPublishableKey('pk_test_51HEdzULvQxsl1JSFusfnqJwKTFlbg4xCV3UKj2l6v2LZDFwjsNfewl3V6yjGhHbnRxtaKJcvOZkjlxRfp7zTBc6p00kVkIXijd');
    //
    let card = {
      number: numTarjeta,//numTarjeta
      expMonth: mesExpiracion,//mesExpiracion
      expYear: anioExpiracion,//anioExpiracion
      cvc: cvc//cvc
     };
   this.stripe.createCardToken(card)
   .then(token => {
    let headers = new Headers({
      "Content-Type": "application/json"
    });
    let options = new RequestOptions({ headers: headers });
    let url = "https://guestresy.com/code/guest_pagos/stripe_config.php";
    let data = JSON.stringify({
      cardToken: token.id,
      amount: montoReservacion, //montoReservacion
      accion: 'stripe_prueba',
      folio: folio
    });
    this.http.post(url, data, options).subscribe(res => {
      console.log('Este es el mensaje', JSON.stringify(res));
      //IF PAGO CON EXITO
      if (res.json().status == "succeeded") {
        
        //SI EL PAGO SE REALIZO CON EXITO SE CAMBIAN LOS ESTATUS A PAGADO
        /* Cambiando estatus del idCompartir a pagado */
        this.afs.collection('compartidas').doc(idCompartir).update({
          estatus_pago: 'Pagado',
          pagoEstatus: true
        });

        this.afs.collection('contCodigosRp').doc(uidRerservacion).update({

          estatus: 1
  
        });

        const alert = this.alertCtrl.create({
         title: '¡ Pago con exito !',
         buttons: [
           {
             text: 'Aceptar',
             handler: () => {
                this.notiReservaCompartida(uidRerservacion, displayNames);
                this.notiReservaPago(displayNames);
             }
           }
         ]
        });
        alert.present();
        

      }
       //IF SALDO INSUFICIENTE
       if (res.json().raw.decline_code == "insufficient_funds") {
         const alert = this.alertCtrl.create({
          title: 'Saldo insuficiente, por favor intente con otra tarjeta. Ir al menu Pago',
          buttons: ['OK']
         });
         alert.present();
       }
      //IF VERIFICAR TARJETA REAL
       if (res.json().raw.decline_code == "do_not_honor") {
         const alert = this.alertCtrl.create({
          title: 'Ocurrio un problema con su tarjeta, verifica que sea correcta. Ir al menu Pago',
          buttons: ['OK']
         });
         alert.present();
          }

  });
   })
   .catch(error => {
     console.log('error',error);
      const alert = this.alertCtrl.create({
       title: 'Ocurrio un problema con su tarjeta, verifica que sea correcta. Ir al menu Pago',
       buttons: ['OK']
      });
      alert.present();
     //alert(error);
    } );
    setTimeout(() => {
     loading.dismiss();
   }, 3000);
}

notiReservaCompartida(idReservacion: string, displayNames: string) {
  this._providerReserva
    .getCompartidaPagadaNoti(idReservacion)
    .subscribe((usersCom) => {
      const usersCompartido = usersCom;
      console.log("Usuarios compartidos: ", usersCompartido);
      usersCompartido.forEach((usersCom) => {
        console.log("PlayerID:", usersCom.playerId);
        if (usersCom.playerId != undefined) {
          console.log("notificacion  a", usersCom.playerId);
          if (this.platform.is("cordova")) {
            const data = {
              topic: usersCom.playerId,
              title: "Resumen de pago",
              body: "Personas faltantes de completar su pago: " + displayNames.toString(),
            };
            this._deviceProvider.sendPushNoti(data).then((resp: any) => {
              console.log('Respuesta noti fcm', resp);
            });
          } else {
            console.log("Solo funciona en dispositivos");
          }
        }
      });
    });
}

notiReservaPago(displayNames: string) {
  if (this.platform.is("cordova")) {
    const data = {
      topic: localStorage.getItem('playerID'),
      title: "Pago exitoso",
      body: "Personas faltantes de completar su pago: " + displayNames.toString(),
    };
    this._deviceProvider.sendPushNoti(data).then((resp: any) => {
      console.log('Respuesta noti fcm', resp);
    });
  } else {
    console.log("Solo funciona en dispositivos");
  }
}

//hacer el pago en stripe de una cuenta normal
cambiaPagandoNormal(uidRerservacion,numTarjeta,mesExpiracion,anioExpiracion,cvc,montoReservacion,folio) {
  console.log('llegaron a pagar',uidRerservacion,numTarjeta,mesExpiracion,anioExpiracion,cvc,montoReservacion);
  // Poppup de carga para procesar el metodo
  let loading = this.loadinCtl.create({
  spinner: "bubbles",
  content: "Procesando pago."
  });//
  loading.present();
  // this.stripe.setPublishableKey('pk_live_51HEdzULvQxsl1JSFvSiy3nGqXSlqQc3lUzKCJWY4ve3YeDyZe3zGAt86GRQjIhof7g38oZNCp5eLxMKbyoP42AWt00yfF5wUz0');
  this.stripe.setPublishableKey('pk_test_51HEdzULvQxsl1JSFusfnqJwKTFlbg4xCV3UKj2l6v2LZDFwjsNfewl3V6yjGhHbnRxtaKJcvOZkjlxRfp7zTBc6p00kVkIXijd');

  //
  let card = {
    number: numTarjeta,//numTarjeta
    expMonth: mesExpiracion,//mesExpiracion
    expYear: anioExpiracion,//anioExpiracion
    cvc: cvc//cvc
   };
 this.stripe.createCardToken(card)
 .then(token => {
  let headers = new Headers({
    "Content-Type": "application/json"
  });
  let options = new RequestOptions({ headers: headers });
  let url = "https://guestresy.com/code/guest_pagos/stripe_config.php";
  let data = JSON.stringify({
    cardToken: token.id,
    amount: montoReservacion, //montoReservacion
    accion: 'stripe_prueba',
    folio: folio
  });
  this.http.post(url, data, options).subscribe(res => {
    console.log('Este es el mensaje', JSON.stringify(res));
    //IF PAGO CON EXITO
    if (res.json().status == "succeeded") {
      const alert = this.alertCtrl.create({
       title: '¡ Pago con exito !',
       buttons: ['OK']
      });
      alert.present();
      //SI EL PAGO SE REALIZO CON EXITO SE CAMBIAN LOS ESTATUS A PAGADO
      /* Cambiando estatus a la reservación estatus_pago */
      this.afs.collection('reservaciones').doc(uidRerservacion).update({
        estatus_pago: 'Pagado'
      });

      // ACTUALIZAMOS EL ESTATUS DEL CODIGO USADO PARA LA RESERVACIÓN PARA QUE PUEDA SER CONTADO EN LOS CORTES

      this.afs.collection('contCodigosRp').doc(uidRerservacion).update({

        estatus: 1

      });

    }
    //IF SALDO INSUFICIENTE
    if (res.json().raw.decline_code == "insufficient_funds") {
      const alert = this.alertCtrl.create({
       title: 'Saldo insuficiente, por favor intente con otra tarjeta. Ir al menu Pago',
       buttons: ['OK']
      });
      alert.present();
    }
   //IF VERIFICAR TARJETA REAL
    if (res.json().raw.decline_code == "do_not_honor") {
      const alert = this.alertCtrl.create({
       title: 'Ocurrio un problema con su tarjeta, verifica que sea correcta. Ir al menu Pago',
       buttons: ['OK']
      });
      alert.present();
       }
});
 })
 .catch(error => {
     //alert('error!');
   //alert(error);
   console.log('error',error);
   const alert = this.alertCtrl.create({
    title: 'Ocurrio un problema con su tarjeta, verifica que sea correcta. Ir al menu Pago',
    buttons: ['OK']
   });
   alert.present();
  } );

  setTimeout(() => {
   loading.dismiss();
 }, 3000);
}

}
