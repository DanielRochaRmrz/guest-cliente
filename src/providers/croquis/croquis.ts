import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";

@Injectable()
export class CroquisProvider {
  usuario: any = {};
  apiURL: string = "https://adminsoft.mx/operacion/guest";

  zonas: AngularFirestoreCollection<any[]>;
  _zonas: Observable<any>;

  constructor(public http: HttpClient, private db: AngularFirestore) {}

  getUser(uid: string) {
    return new Promise((resolve, rejects) => {
      let usuariosRef = this.db.collection("users").doc(uid);
      usuariosRef.get().subscribe((user) => {
        this.usuario = user.data();
        resolve(this.usuario);
      });
    });
  }

  getRsvpHttp(idRsvp: string) {
    return new Promise((resolve, rejects) => {
      const url = `${this.apiURL}/obtener_rsvp/${idRsvp}`;
      this.http.get(url).subscribe((rsvp: any) => {
        resolve(rsvp.consulta);
      });
    });
  }

  public getZonas(idSucursal: string) {
    console.log("idSucursal", idSucursal);
    this.zonas = this.db.collection<any>("zonas", (ref) =>
      ref.where("uidSucursal", "==", idSucursal)
    );
    this._zonas = this.zonas.valueChanges();
    return (this._zonas = this.zonas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }
  
  public getZona(idZona: string) {
    return new Promise((resolve, rejects) => {
      const zonaRef = this.db.collection("zonas").doc(idZona);
      zonaRef.get().subscribe( (data) => {
        const zona = data.data();
        resolve(zona);
      });
    });
  }

  public updateZona(idReserva: string, idZona: string) {
    return new Promise((resolve, rejects) => {
      this.db.collection("reservaciones").doc(idReserva).update({
        idZona: idZona
      }).then(() => {
        resolve(true);
      }).catch((err) => {
        rejects(err);
      });
    })
    
  }

  public getCroquisImg(idSucursal: string) {
    this.zonas = this.db.collection<any>("croquis_img", (ref) =>
      ref.where("idSucursal", "==", idSucursal)
    );
    this._zonas = this.zonas.valueChanges();
    return (this._zonas = this.zonas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

}
