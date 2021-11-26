import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


import { Device } from "@ionic-native/device";
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class DeviceProvider {
  
  apiURL: string = 'https://adminsoft.mx/operacion/guest'
  platform: string;
  userId: string = localStorage.getItem('uid');

  constructor(
    public http: HttpClient,
    private device: Device,
    public db: AngularFirestore
  ) { 
    if(this.device.platform == 'android'){
      this.platform = "1";
    } else {
      this.platform = "0";
    }
  }

  deviceInfo() {
      const deviceInfo = {
        token: localStorage.getItem('tokenPush'),
        version: localStorage.getItem('versionApp'),
        device_os: this.device.version,
        platform: this.platform,
        model: this.device.model
      }
      const url = `${this.apiURL}/addDevice`;
      this.http.post(url, deviceInfo).subscribe((resp: any) => {
        console.log(resp.id);
        this.updatePlayerID(resp.id)
      });
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
