import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


import { AngularFirestore } from '@angular/fire/firestore';
import { Device } from "@ionic-native/device";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic";
import { Platform } from 'ionic-angular';


@Injectable()
export class DeviceProvider {
  
  apiURL: string = 'https://adminsoft.mx/operacion/guest';
  userId: string = localStorage.getItem('uid');

  constructor(
    public http: HttpClient,
    private device: Device,
    public db: AngularFirestore,
    private platform: Platform
  ) { }


  async deviceInfo()  {
    console.log('Device ID', this.device.uuid);
    const playerID = String(this.device.uuid);
    this.updatePlayerID(playerID);
    const authStatus = await FCM.requestPushPermission();
    console.log("authStatus -->", authStatus);
    if (authStatus == true) {

      FCM.subscribeToTopic(playerID);

      if (this.platform.is('ios')) {
        let fcmToken = await FCM.getAPNSToken();
        console.log("fcmToken -->", fcmToken);
        localStorage.setItem("tokenPush", fcmToken);
      }
      
      if (this.platform.is('android')) {
        let fcmToken = await FCM.getToken();
        console.log("fcmToken -->", fcmToken);
        localStorage.setItem("tokenPush", fcmToken);
      }


      FCM.onNotification().subscribe(
        (data) => {
          if (data.wasTapped) {
            //cuando nuestra app esta en segundo plano
            console.log("Estamos en segundo plano", JSON.stringify(data));
          } else {
            //ocurre cuando nuestra app esta en primer plano
            console.log("Estamos en primer plano", JSON.stringify(data));
          }
        },
        (error) => {
          console.log("Error -->", error);
        }
      );
    }
  }

  updatePlayerID(playerID: string) {
    this.db.collection("users").doc(this.userId).update({
      playerID: playerID
    }).then(() => {
      console.log("Se actualizo");
    }).catch( (error) => {
      console.log(JSON.stringify(error));
    });
  }
  
}
