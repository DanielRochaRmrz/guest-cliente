import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';
import { UserProvider } from '../user/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class PushNotiProvider {

  userId: any = '';
  
  constructor(
    public oneSignal: OneSignal,
    public platform: Platform,
    public _providerUser: UserProvider,
    public afireauth: AngularFireAuth,
    public db: AngularFirestore
  ) {
    console.log("Hello PushNotiProvider Provider");
  }

  init_push_noti() {
    if (this.platform.is("cordova")) {
      window["plugins"].oneSignal.startInit(
        "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
        "853477386824"
      );

      window["plugins"].oneSignal.inFocusDisplaying(
        window["plugins"].oneSignal.OSInFocusDisplayOption.InAppAlert
      );

      window["plugins"].oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
      });

      window["plugins"].oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      window["plugins"].oneSignal.getIds().then(data => {
        // alert('Data :' + JSON.stringify(data));
        const uidUser = localStorage.getItem("uid");
        //console.log('id del usuario en sesion', uidUser);
        const playerID = data.userId;
        //console.log('playerid del usuario en sesion', playerID);
        this._providerUser.idOneSignal(uidUser,playerID);
        //guardar playerid en el localStorage
        localStorage.setItem("playerID", playerID);
      });

      window["plugins"].oneSignal.endInit();
    } else {
      console.log("*** OneSignal no funciona en web ***");
    }
  }

  init_notification() {
    if (this.platform.is("cordova")) {
      window["plugins"].oneSignal.startInit(
        "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
        "853477386824"
      );

      window["plugins"].oneSignal.inFocusDisplaying(
        window["plugins"].oneSignal.OSInFocusDisplayOption.InAppAlert
      );

      window["plugins"].oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
      });

      window["plugins"].oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      window["plugins"].oneSignal.getIds().then(data => {
        // alert('Data :' + JSON.stringify(data));
        const uidUser = localStorage.getItem("uid");
        //console.log('id del usuario en sesion', uidUser);
        const playerID = data.userId;
        //console.log('playerid del usuario en sesion', playerID);
        this._providerUser.idOneSignal(uidUser,playerID);
        //guardar playerid en el localStorage
        localStorage.setItem("playerID", playerID);

        this.db.collection("users").doc(this.userId).update({
          playerID: playerID
        }).then(() => {
          console.log("Se actualizo");
        });

      });

      window["plugins"].oneSignal.endInit();
    } else {
      console.log("*** OneSignal no funciona en web ***");
    }
  }

}
