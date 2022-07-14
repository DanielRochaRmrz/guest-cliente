import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { DeviceProvider } from '../device/device';


@Injectable()
export class PushNotiProvider {
  
  constructor(
    public platform: Platform,
    private _deviceProvider: DeviceProvider,
    public af: AngularFirestore,
  ) {
    console.log("Hello PushNotiProvider Provider");
  }

  public PushNotiCompartidos(reservaId: string) {
    return new Promise((resolve, reject) => {
      const userCompartidoRef = this.af.collection("compartidas").ref;
      userCompartidoRef
        .where("idReservacion", "==", reservaId)
        .where("estatus", "==", "Espera")
        .get()
        .then((data) => {
          data.forEach((userCom) => {
            const comUsers = userCom.data();
            const usersCompartidoPayerID = comUsers.playerId;
            console.log("Usuarios compartidos: ", usersCompartidoPayerID);
            console.log("PlayerID:", usersCompartidoPayerID);
            if (usersCompartidoPayerID != undefined) {
              console.log("notificacion  a", usersCompartidoPayerID);
              if (this.platform.is("cordova")) {
                const data = {
                  topic: usersCompartidoPayerID,
                  title: "Reservación compartida",
                  body: "Han compartido una reservación contigo",
                };
                this._deviceProvider.sendPushNoti(data).then((resp: any) => {
                  console.log("Respuesta noti fcm", resp);
                  resolve(resp);
                });
              } else {
                console.log("Solo funciona en dispositivos");
              }
            }
          });
        });
    });
  }

  public PushNotiAceptaReservacion(reservaId: string, nombre: string) {
    return new Promise((resolve, reject) => {
      const reservacion = this.af.collection("reservaciones").ref;
      reservacion
        .where("idReservacion", "==", reservaId)
        .get()
        .then((data) => {
          data.forEach((reserva) => {
            const rsv = reserva.data();
            const userPayerID = rsv.playerIDs;
            console.log("Usuarios compartidos: ", userPayerID);
            console.log("PlayerID:", userPayerID);
            if (userPayerID != undefined) {
              console.log("notificacion  a", userPayerID);
              if (this.platform.is("cordova")) {
                const data = {
                  topic: userPayerID,
                  title: "",
                  body: `${nombre} ha aceptado compartir la cuenta contigo`,
                };
                this._deviceProvider.sendPushNoti(data).then((resp: any) => {
                  console.log("Respuesta noti fcm", resp);
                  resolve(resp);
                });
              } else {
                console.log("Solo funciona en dispositivos");
              }
            }
          });
        });
    });
  }

}
