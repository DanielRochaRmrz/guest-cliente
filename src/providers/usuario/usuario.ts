import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "angularfire2/auth";
import { map } from "rxjs/operators";

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UsuarioProvider {
  private apiUrl =
    "https://us-central1-guestreservation-8b24b.cloudfunctions.net/app";

  data: any = {};

  usuario: Credenciales = {};

  codigo: AngularFirestoreCollection<any[]>;
  _codigo: Observable<any>;

  tarjetas: AngularFirestoreCollection<any[]>;
  _tarjetas: Observable<any>;

  tarjetasRegistradas: AngularFirestoreCollection<any[]>;
  _tarjetasRegistradas: Observable<any>;

  usuarioID: AngularFirestoreCollection<any[]>;
  _usuarioID: Observable<any>;

  tarjetaPagar: AngularFirestoreCollection<any[]>;
  _tarjetaPagar: Observable<any>;

  tarjetaPagar2: AngularFirestoreCollection<any[]>;
  _tarjetaPagar2: Observable<any>;

  constructor(
    public afDB: AngularFireDatabase,
    public afireauth: AngularFireAuth,
    public afs: AngularFirestore,
    private http: HttpClient
  ) {
    console.log("Hello UsuarioProvider Provider");
  }

  cargarUsuario(
    nombre: string,
    email: string,
    imagen: string,
    uid: string,
    provider: string
  ) {
    this.usuario.nombre = nombre;
    this.usuario.email = email;
    this.usuario.imagen = imagen;
    this.usuario.uid = uid;
    this.usuario.provider = provider;
  }

  public getCodigo(idx) {
    // return this.afiredatabase.object("sucursales/" + uid);
    this.codigo = this.afs.collection<any>("usuarios", (ref) =>
      ref.where("uid", "==", idx)
    );
    this._codigo = this.codigo.valueChanges();
    return (this._codigo = this.codigo.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc;
          return data;
        });
      })
    ));
  }

  public getUser(uid) {
    return this.afDB.object("users/" + uid);
  }

  inhabilitar(uid) {
    console.log(uid);
    this.data = {
      active: false,
    };
    this.afs.collection("users").doc(uid).update(this.data);
    // this.afDB.database.ref('users/'+ uid).update(this.data);
  }

  habilitar(uid) {
    console.log(uid);
    this.data = {
      active: true,
    };
    this.afs.collection("users").doc(uid).update(this.data);
    //  this.afDB.database.ref('users/'+ uid).update(this.data);
  }

  //Agregar el  telfono del usuario
  public agregarTelefono(idx, telefono, ciudad) {
    console.log("El user llego al provider", idx);
    console.log("El telfono llego al provider", telefono);
    console.log("La ciudad llego al provider", ciudad);
    return new Promise((resolve, reject) => {
      this.afs
        .collection("users")
        .doc(idx)
        .update({
          phoneNumber: telefono,
          ciudad: ciudad,
        })
        .then((reserva) => {
          console.log("Reservación actualizada: ", JSON.stringify(reserva));
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //insertar registro de tarjeta
  public agregarTarjeta(
    idUsuario,
    numTarjeta,
    anioExp,
    mesExp,
    numTarjeta4dijitos
  ) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("tarjetas")
        .add({
          idUsuario: idUsuario,
          numTarjeta: numTarjeta,
          numTarjeta4dijitos: numTarjeta4dijitos,
          anioExpiracion: anioExp,
          mesExpiracion: mesExp,
          estatus: "ACTIVA",
        })
        .then((reserva) => {
          console.log("registro exitoso: ", reserva.id);
          this.updateTarjetaId(reserva.id);
          resolve({ success: true, idTarjeta: reserva.id });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  //guardar el regstro d euna  nueva tarjeta registrada
  public updateTarjetaId(ID) {
    this.afs
      .collection("tarjetas")
      .doc(ID)
      .update({
        idTarjeta: ID,
      })
      .then(() => {})
      .catch(() => {});
  }

  //obtener el ID del usuario con el numero de telefono recibido
  public getUsuarioID(idx: string) {
    this.usuarioID = this.afs.collection<any>("users", (ref) =>
      ref.where("phoneNumber", "==", idx)
    );
    this._usuarioID = this.usuarioID.valueChanges();
    return (this._usuarioID = this.usuarioID.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener la tarjeta registrada y activa del id del usuario obtenido
  public getTarjetaPagar(idx) {
    this.tarjetaPagar = this.afs.collection<any>("tarjetas", (ref) =>
      ref.where("idUsuario", "==", idx).where("estatus", "==", "ACTIVA")
    );
    this._tarjetaPagar = this.tarjetaPagar.valueChanges();
    return (this._tarjetaPagar = this.tarjetaPagar.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public _getTarjetaPagar(idx: string) {
    return new Promise((resolve, reject) => {
      const ref = this.afs.collection("tarjetas").ref;
      ref
        .where("idUsuario", "==", idx)
        .where("estatus", "==", "ACTIVA")
        .get()
        .then((query) => {
          query.forEach((tarjeta) => {
            const t = tarjeta.data();
            resolve(t);
          });
        });
    });
  }

  //obtener la tarjeta registrada y activa del id del usuario
  public getTarjetaPagar2(idx) {
    this.tarjetaPagar2 = this.afs.collection<any>("tarjetas", (ref) =>
      ref.where("idUsuario", "==", idx).where("estatus", "==", "ACTIVA")
    );
    this._tarjetaPagar2 = this.tarjetaPagar2.valueChanges();
    return (this._tarjetaPagar2 = this.tarjetaPagar2.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener todas las trajetas registradas del usuario
  public getTarjetasUser(idx: string) {
    this.tarjetas = this.afs.collection<any>("tarjetas", (ref) =>
      ref.where("idUsuario", "==", idx).where("estatus", "==", "ACTIVA")
    );
    this._tarjetas = this.tarjetas.valueChanges();
    return (this._tarjetas = this.tarjetas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener todas las trajetas registradas del usuario
  public getAllTarjetas(idx: string) {
    return new Promise((resolve, reject) => {
      const refTarjetas = this.afs.collection("tarjetas").ref;
      refTarjetas
        .where("idUsuario", "==", idx)
        .where("estatus", "==", "ACTIVA")
        .get()
        .then((tarjetas) => {
          tarjetas.forEach((data) => {
            const tarjeta = data.data() as any;
            resolve(tarjeta);
          });
        });
    });
  }

  //obtener todas las trajetas registradas del usuario que sean diferentes a eliminadas
  public getTarjetasRegistradas(idx) {
    console.log("mi user en provider", idx);
    // return this.afiredatabase.object("sucursales/" + uid);
    this.tarjetasRegistradas = this.afs.collection<any>("tarjetas", (ref) =>
      ref.where("idUsuario", "==", idx).where("estatus", "==", "ACTIVA")
    );
    this._tarjetasRegistradas = this.tarjetasRegistradas.valueChanges();
    return (this._tarjetasRegistradas = this.tarjetasRegistradas
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action: any) => {
            const data = action.payload.doc.data() as any;
            data.$key = action.payload.doc.id;
            return data;
          });
        })
      ));
  }

  public getTarjeta(idTarjeta: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("tarjetas")
        .doc(idTarjeta)
        .get()
        .subscribe((tarjeta) => {
          const data = tarjeta.data() as any;
          resolve(data);
        });
    });
  }

  //Cambiar estatus de la tarjeta a eliminado
  public updateTarjetaEliminar(idx) {
    //eliminar definitivamente de la base la tarjeta
    var promise = new Promise((resolve, reject) => {
      this.afs
        .collection("tarjetas")
        .doc(idx)
        .delete()
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  //Cambiar estatus de la tarjeta a ACTIVA
  public updateTarjetaActiva(idx) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("tarjetas")
        .doc(idx)
        .update({
          estatus: "ACTIVA",
        })
        .then((reserva) => {
          console.log("tarjeta activada: ", JSON.stringify(reserva));
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  //Volver inactiva cuando se cambia a otra tarjeta
  public updateTarjetaVolverInactiva(idx) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("tarjetas")
        .doc(idx)
        .update({
          estatus: "INACTIVA",
        })
        .then((reserva) => {
          console.log("Reservación actualizada: ", JSON.stringify(reserva));
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public updatePerfil(idx, infoPerfil) {
    return new Promise((resolve, reject) => {
      console.log("perfil: ", infoPerfil.nombre);

      this.afs
        .collection("users")
        .doc(idx)
        .update({
          displayName: infoPerfil.nombre,
          email: infoPerfil.correo,
          phoneNumber: infoPerfil.telefono,
          tarjeta: infoPerfil.tarjeta,
        })
        .then((reserva) => {
          console.log("perfil actualizada: ", JSON.stringify(reserva));
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // buscarTelefono(tel: string) {
  //   return new Promise((resolve, reject) => {
  //     this.afs
  //       .collection("users", (ref) =>
  //         ref.where("phoneNumber", "==", tel)
  //       )
  //       .valueChanges()
  //       .subscribe(query => {
  //         query.map(data => {
  //           console.log('Data -->', data);
  //           resolve(data);
  //         });
  //       });
  //   });
  // }

  buscarTelefono(tel: string) {
    return new Promise((resolve, reject) => {
      const users = this.afs.collection("users").ref;
      users
        .where("phoneNumber", "==", tel)
        .get()
        .then((query) => {
          const basia = query.empty;
          console.log("basia", basia);
          resolve(basia);
        });
    });
  }

  buscarUserTelefono(tel: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection("users", (ref) => ref.where("phoneNumber", "==", tel))
        .valueChanges()
        .subscribe((data: any) => {
          const usTel = data;
          resolve(JSON.stringify(usTel));
        });
    });
  }

  deleteAccount(uid: string) {
    return new Promise((resolve, reject) => {
      this.afDB.database.ref(`users/${uid}`).ref.remove();
      const tarjetas = this.afs.collection("tarjetas").ref;
      tarjetas
        .where("idUsuario", "==", uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      const body = {
        uid: uid,
      };
      this.http.post(`${this.apiUrl}/userDelete`, body).subscribe((resp) => {
        resolve(resp);
      });
    });
  }
}

export interface Credenciales {
  nombre?: string;
  email?: string;
  imagen?: string;
  uid?: string;
  phone?: string;
  provider?: string;
}
