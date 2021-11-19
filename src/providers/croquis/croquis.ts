import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class CroquisProvider {

  usuario: any = {};
  apiURL: string = 'https://adminsoft.mx/operacion/guest';

  constructor(public http: HttpClient, private db: AngularFirestore) {}

  getUser(){
    return new Promise((resolve, rejects) => {
      let usuariosRef = this.db.collection("users").doc("HaP68VmphnVPFtzNOsLvFCk8A2o1");
        usuariosRef.get().subscribe((user) => {
          this.usuario = user.data();
          resolve(this.usuario);
        });
    });
  }

  getRsvpHttp(idRsvp: string){
    return new Promise((resolve, rejects) => {
      const url = `${this.apiURL}/obtener_rsvp/${idRsvp}`;
      this.http.get(url).subscribe( (rsvp: any) => {
        resolve(rsvp.consulta);
      });
    });
  }

}
