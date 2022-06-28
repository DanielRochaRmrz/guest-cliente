import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import * as moment from "moment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ReservacionProvider {
  areas: AngularFirestoreCollection<any[]>;
  _areas: Observable<any>;

  productos: AngularFirestoreCollection<any[]>;
  _productos: Observable<any>;

  carta: AngularFirestoreCollection<any[]>;
  _carta: Observable<any>;

  areasNombre: AngularFirestoreCollection<any[]>;
  _areasNombre: Observable<any>;

  zonas: AngularFirestoreCollection<any[]>;
  _zonas: Observable<any>;

  reservacion: AngularFirestoreDocument<any[]>;
  _reservacion: Observable<any>;

  zona: AngularFirestoreDocument<any[]>;
  _zona: Observable<any>;

  reservaCliente: AngularFirestoreCollection<any[]>;
  _reservaCliente: Observable<any>;

  reservaProducto: AngularFirestoreCollection<any[]>;
  _reservaProducto: Observable<any>;

  reservaInfo: AngularFirestoreCollection<any[]>;
  _reservaInfo: Observable<any>;

  reservaInfo2: AngularFirestoreCollection<any[]>;
  _reservaInfo2: Observable<any>;

  telefonos: AngularFirestoreCollection<any[]>;
  _telefonos: Observable<any>;

  teluser: AngularFirestoreCollection<any[]>;
  _teluser: Observable<any>;

  telpropio: AngularFirestoreCollection<any[]>;
  _telpropio: Observable<any>;

  resCompartida: AngularFirestoreCollection<any[]>;
  _resCompartida: Observable<any>;

  comAceptadas: AngularFirestoreCollection<any[]>;
  _comAceptadas: Observable<any>;

  comEscaneos: AngularFirestoreCollection<any[]>;
  _comEscaneos: Observable<any>;

  comEspera: AngularFirestoreCollection<any[]>;
  _comEspera: Observable<any>;
  comRes: AngularFirestoreCollection<any[]>;
  _comRes: Observable<any>;

  userCompartido: AngularFirestoreCollection<any[]>;
  _userCompartido: Observable<any>;

  playerID: AngularFirestoreCollection<any[]>;
  _playerID: Observable<any>;

  idCompartir: AngularFirestoreCollection<any[]>;
  _idCompartir: Observable<any>;

  historial: AngularFirestoreCollection<any[]>;
  _historial: Observable<any>;

  sucursal: AngularFirestoreCollection<any[]>;
  _sucursal: Observable<any>;

  reservacionesCollection: AngularFirestoreCollection<any>;
  collection: Observable<any>;

  constructor(public af: AngularFirestore, public http: HttpClient) {
    console.log("Hello ReservacionProvider Provider");
  }

  public getHistorial(idx) {
    this.historial = this.af.collection<any>("reservaciones", (ref) =>
      ref.where("estatus", "==", "Pagando").where("idUsuario", "==", idx)
    );
    this._historial = this.historial.valueChanges();
    return (this._historial = this.historial.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getAreas(idx) {
    this.areas = this.af.collection<any>("areas", (ref) =>
      ref.where("uidSucursal", "==", idx)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getReservacionesProducto(idx) {
    this.reservaProducto = this.af.collection<any>("productos", (ref) =>
      ref.where("idReservacion", "==", idx)
    );
    this._reservaProducto = this.reservaProducto.valueChanges();
    return (this._reservaProducto = this.reservaProducto.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getZonas(idx) {
    this.areas = this.af.collection<any>("zonas", (ref) =>
      ref.where("uidSucursal", "==", idx)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getProductos(idx: string) {
    this.areas = this.af.collection<any>("productos", (ref) =>
      ref.where("idReservacion", "==", idx)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getProductosAdd(claveProducto: string, idReservacion: string) {
    this.productos = this.af.collection<any>("productos", (ref) =>
      ref
        .where("idReservacion", "==", idReservacion)
        .where("idProducto", "==", claveProducto)
    );
    this._productos = this.productos.valueChanges();
    return (this._productos = this.productos.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getInfo(idx) {
    this.reservaInfo = this.af.collection<any>("reservaciones", (ref) =>
      ref.where("idReservacion", "==", idx)
    );
    this._reservaInfo = this.reservaInfo.valueChanges();
    return (this._reservaInfo = this.reservaInfo.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }
  public getReserCom(idx) {
    this.reservaInfo2 = this.af.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idx)
    );
    this._reservaInfo2 = this.reservaInfo2.valueChanges();
    return (this._reservaInfo2 = this.reservaInfo2.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener numeros de telefono
  public getTelefono(idx) {
    this.telefonos = this.af.collection<any>("users", (ref) =>
      ref.where("phoneNumber", "==", idx)
    );
    this._telefonos = this.telefonos.valueChanges();
    return (this._telefonos = this.telefonos.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener playerID
  public buscarPlayerid(idx) {
    this.playerID = this.af.collection<any>("users", (ref) =>
      ref.where("phoneNumber", "==", idx)
    );
    this._playerID = this.playerID.valueChanges();
    return (this._playerID = this.playerID.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener numero de telefono
  public getTelUser(idx) {
    this.teluser = this.af.collection<any>("users", (ref) =>
      ref.where("uid", "==", idx)
    );
    this._teluser = this.teluser.valueChanges();
    return (this._teluser = this.teluser.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener numero de telefono
  public getTelPropio(idx) {
    this.telpropio = this.af.collection<any>("users", (ref) =>
      ref.where("uid", "==", idx)
    );
    this._telpropio = this.telpropio.valueChanges();
    return (this._telpropio = this.telpropio.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getReservacionesCliente(idx: string) {
    this.reservaCliente = this.af.collection<any>("reservaciones", (ref) =>
      ref
        .where("idUsuario", "==", idx)
        .where("estatusFinal", "==", "rsv_copletada")
        .where("estatus", "in", ["Creando", "Modificado", "Aceptado"])
    );
    this._reservaCliente = this.reservaCliente.valueChanges();
    return (this._reservaCliente = this.reservaCliente.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getReservacionesClienteHistorial(idx: string) {
    this.reservaCliente = this.af.collection<any>("reservaciones", (ref) =>
      ref
        .where("idUsuario", "==", idx)
        .where("estatusFinal", "==", "rsv_copletada")
        .where("estatus", "in", ["Pagado", "Finalizado"])
    );
    this._reservaCliente = this.reservaCliente.valueChanges();
    return (this._reservaCliente = this.reservaCliente.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener reservacion compartida en la que esta el usuario
  public getReservacionCompartida(telefono: string) {
    this.resCompartida = this.af.collection<any>("compartidas", (ref) =>
      ref
        .where("telefono", "==", telefono)
        .where("estatusFinal", "==", "rsv_copletada")
        .where("estatus", "in", ["Espera", "Aceptado"])
        .where("estatus_escaneo", "!=", "OK")
    );
    this._resCompartida = this.resCompartida.valueChanges();
    return (this._resCompartida = this.resCompartida.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener reservacion compartida en la que esta el usuario
  public getReservacionCompartidaHistorial(telefono: string, uid: string) {
    this.resCompartida = this.af.collection<any>("compartidas", (ref) =>
      ref
        .where("telefono", "==", telefono)
        .where("estatusFinal", "==", "rsv_copletada")
        .where("estatus_escaneo", "==", "OK")
        .where("idUsuario", "!=", uid)
    );
    this._resCompartida = this.resCompartida.valueChanges();
    return (this._resCompartida = this.resCompartida.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener reservaciones compartidas por reservación
  public getCompartidaIdReserva(idReservacion: string) {
    this.resCompartida = this.af.collection<any>("compartidas", (ref) =>
      ref
        .where("idReservacion", "==", idReservacion)
        .where("estatusFinal", "==", "rsv_copletada")
        .where("estatus", "in", ["Espera", "Aceptado"])
    );
    this._resCompartida = this.resCompartida.valueChanges();
    return (this._resCompartida = this.resCompartida.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener reservacion compartida aceptada por el usuario
  public getCompartidaAceptada(idx) {
    this.comAceptadas = this.af.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idx).where("estatus", "==", "Aceptado")
    );
    this._comAceptadas = this.comAceptadas.valueChanges();
    return (this._comAceptadas = this.comAceptadas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener er escaneados de reservaciones compartidas
  public getEscaneos(idx) {
    this.comEscaneos = this.af.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idx).where("estatus_escaneo", "==", "NO")
    );
    this._comEscaneos = this.comEscaneos.valueChanges();
    return (this._comEscaneos = this.comEscaneos.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener reservacion compartida en espera
  public consultarEspera(idx) {
    this.comEspera = this.af.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idx).where("estatus", "==", "Espera")
    );
    this._comEspera = this.comEspera.valueChanges();
    return (this._comEspera = this.comEspera.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener reservacion compartida aceptada por el usuario
  public getCompartidaPagada(idx) {
    this.comAceptadas = this.af.collection<any>("compartidas", (ref) =>
      ref
        .where("idReservacion", "==", idx)
        .where("estatus_pago", "==", "Pagado")
    );
    this._comAceptadas = this.comAceptadas.valueChanges();
    return (this._comAceptadas = this.comAceptadas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener reservacion compartida aceptada por el usuario
  public getCompartidaPagadaNoti(idx) {
    this.comAceptadas = this.af.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idx).where("pagoEstatus", "==", false)
    );
    this._comAceptadas = this.comAceptadas.valueChanges();
    return (this._comAceptadas = this.comAceptadas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener reservacion compartida aceptada por el usuario
  public getCompartidaPagoNoti(idx) {
    this.comAceptadas = this.af.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idx).where("pagoEstatus", "==", true)
    );
    this._comAceptadas = this.comAceptadas.valueChanges();
    return (this._comAceptadas = this.comAceptadas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public consultarEstatusRe(idx) {
    this.comRes = this.af.collection<any>("reservaciones", (ref) =>
      ref.where("idReservacion", "==", idx)
    );
    this._comRes = this.comRes.valueChanges();
    return (this._comRes = this.comRes.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  //obtener los usuarios que aceptaron compartir la reservacion para mandar la notificacion
  public getUsersCompartido(idx) {
    this.userCompartido = this.af.collection<any>("compartidas", (ref) =>
      ref.where("idReservacion", "==", idx).where("estatus", "==", "Espera")
    );
    this._userCompartido = this.userCompartido.valueChanges();
    return (this._userCompartido = this.userCompartido.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getMesas(idx, area, zona) {
    this.areas = this.af.collection<any>("mesas", (ref) =>
      ref
        .where("uidSucursal", "==", idx)
        .where("uidArea", "==", area)
        .where("uidZona", "==", zona)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public saveReservacion(reservacion) {
    return new Promise((resolve, reject) => {
      //sacar un folio de la  reservacion
      let a = "1000000";
      const folio = Math.round(
        Math.random() * (9999999 - 1000000) + parseInt(a)
      );
      const fecha = moment(reservacion.fecha).format("x");
      const hora = moment(reservacion.hora, "HH:mm").format("hh:mm a");
      const idUsuario = localStorage.getItem("uid");
      this.af
        .collection("reservaciones")
        .add({
          numPersonas: reservacion.numPersonas,
          hora: hora,
          fechaR: reservacion.fecha,
          fechaR_: fecha,
          estatus: "Creando",
          estatusFinal: "rsv_incompleta",
          idSucursal: reservacion.idSucursal,
          idevento: reservacion.idevento,
          idUsuario: idUsuario,
          folio: "R" + folio,
        })
        .then((reserva) => {
          this.updateReservaId(reserva.id);
          resolve({ success: true, idReservacion: reserva.id });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public saveCompartir(telefono, idReservacion, idUsuario, player) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("compartidas")
        .add({
          telefono: telefono,
          idReservacion: idReservacion,
          idUsuario: idUsuario,
          estatus: "Espera",
          totalDividido: 0,
          playerId: player,
          estatus_escaneo: "NO",
          estatusFinal: "rsv_incompleta",
        })
        .then((reserva) => {
          this.updateCompartirId(reserva.id);
          resolve({ success: true, idCompartir: reserva.id });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public saveCompartirTodos(telefono, idReservacion, idUsuario, idSucursal) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("compartidas")
        .add({
          telefono: telefono,
          idReservacion: idReservacion,
          idUsuario: idUsuario,
          estatus: "Espera",
          totalDividido: 0,
          estatus_escaneo: "NO",
          estatusFinal: "rsv_incompleta",
          pagoEstatus: false,
          idSucursal: idSucursal,
        })
        .then((reserva) => {
          this.updateCompartirId(reserva.id);
          resolve({ success: true, idCompartir: reserva.id });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //insertar el numero del ususrio en sesion en la tabla al compartir una cuenta
  public saveCompartirPropio(telefono, idReservacion, idUsuario, idSucursal) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("compartida", "true");
      const playerID = localStorage.getItem("playerID");
      this.af
        .collection("compartidas")
        .add({
          telefono: telefono,
          idReservacion: idReservacion,
          idUsuario: idUsuario,
          estatus: "Aceptado",
          totalDividido: 0,
          playerId: playerID,
          estatus_escaneo: "NO",
          estatusFinal: "rsv_incompleta",
          pagoEstatus: false,
          idSucursal: idSucursal,
        })
        .then((reserva) => {
          this.updateCompartirId(reserva.id);
          resolve({ success: true, idCompartir: reserva.id });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public updateReservacion(idx, reservacion) {
    return new Promise((resolve, reject) => {
      const fecha = moment(reservacion.fecha).format("x");
      const hora = moment(reservacion.hora, "HH:mm").format("hh:mm a");
      const idUsuario = localStorage.getItem("uid");

      this.af
        .collection("reservaciones")
        .doc(idx)
        .update({
          numPersonas: reservacion.numPersonas,
          hora: hora,
          fechaR: reservacion.fecha,
          fechaR_: fecha,
          estatus: "Creando",
          estatusFinal: "rsv_incompleta",
          idSucursal: reservacion.idSucursal,
          idevento: reservacion.idevento,
          idUsuario: idUsuario,
        })
        .then((reserva) => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //Cambiar estatus de la reservacion a editado despues de cambiar productos
  public updateReservacionEstatus(idx) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("reservaciones")
        .doc(idx)
        .update({
          estatus: "Aceptado",
        })
        .then((reserva) => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  //Cambiar estatus de la reservacion a cancelar cuando se cambian las zonas o areas
  public updateReservacioCancelado(idx) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("reservaciones")
        .doc(idx)
        .update({
          estatus: "Cancelado",
        })
        .then((reserva) => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //Cambiar estaus de compartido aceptado
  public updateCompartirAceptar(idx) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("compartidas")
        .doc(idx)
        .update({
          estatus: "Aceptado",
        })
        .then((reserva) => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //Cambiar estaus de compartido rechazado
  public updateCompartirRechazar(idx) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("compartidas")
        .doc(idx)
        .update({
          estatus: "Rechazado",
        })
        .then((reserva) => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  //Cambiar estatus de a creado-compartido cuando ya ningun usuario esta en espera
  public updateCreadaCompartida(idx) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("reservaciones")
        .doc(idx)
        .update({
          estatus: "CreadaCompartida",
        })
        .then((reserva) => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //Insertar cantidad del total dividido que le corresponde a cada usuario
  public compartirDividido(idx, totalDividido) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("compartidas")
        .doc(idx)
        .update({
          totalDividido: totalDividido,
        })
        .then((reserva) => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  //Cambiar estatus de la reservacion a compartida
  public updateReservacionCompartida(idx) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("reservaciones")
        .doc(idx)
        .update({
          estatus: "Compartida",
        })
        .then((reserva) => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public addProducto(producto) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("productos")
        .add({
          producto: producto.producto,
          cantidad: producto.cantidad,
          total: producto.total,
          costo: producto.costo,
          idProducto: producto.idProducto,
          idReservacion: producto.idReservacion,
          img: producto.img,
        })
        .then((reserva) => {
          this.updateReservaId(reserva.id);
          resolve({ success: true, idReservacion: reserva.id });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public updateProducto(producto: any, ID: string) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("productos")
        .doc(ID)
        .update({
          cantidad: producto.cantidad,
          costo: producto.costo,
          total: producto.total,
        })
        .then(() => {
          resolve({ success: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public updateReservaId(ID) {
    this.af
      .collection("reservaciones")
      .doc(ID)
      .update({
        idReservacion: ID,
      })
      .then(() => {})
      .catch(() => {});
  }

  public updateCompartirId(ID) {
    this.af
      .collection("compartidas")
      .doc(ID)
      .update({
        idCompartir: ID,
      })
      .then(() => {})
      .catch(() => {});
  }

  public getReservacion(idx) {
    this.reservacion = this.af.doc<any>(`reservaciones/${idx}`);
    // this.pedidoDoc = this.afs.collection<Servicios>('servicios').doc(`/${idPedido}`).collection<Pedidos>('pedidos');
    return (this._reservacion = this.reservacion.snapshotChanges().pipe(
      map((action: any) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  public getZona(idZona: string) {
    this.zona = this.af.doc<any>(`zonas/${idZona}`);
    return (this._zona = this.zona.snapshotChanges().pipe(
      map((action: any) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as any;
          data.uid = action.payload.id;
          return data;
        }
      })
    ));
  }

  public getZonaHttp(idZona: string) {
    return new Promise((resolve, rejects) => {
      const url = `https://adminsoft.mx/operacion/guest/obtener_zona/${idZona}`;
      this.http.get(url).subscribe((resp: any) => {
        const data = resp.consulta;
        resolve(data);
      });
    });
  }

  deleteReservacion(idReservacion) {
    this.af
      .collection("reservaciones")
      .doc(idReservacion)
      .delete()
      .then(function () {})
      .catch(function (error) {});

    const pedidosProductServ = this.af.collection<any>("productos", (ref) =>
      ref.where("idReservacion", "==", idReservacion)
    );

    pedidosProductServ.get().subscribe(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });

    this.eliminar_rsvp(idReservacion);
  }

  deleteProduct(idReservacion) {
    this.af
      .collection("reservaciones")
      .doc(idReservacion)
      .delete()
      .then(function () {})
      .catch(function (error) {});

    const pedidosProductServ = this.af.collection<any>("productos", (ref) =>
      ref.where("idReservacion", "==", idReservacion)
    );

    pedidosProductServ.get().subscribe(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  }

  deleteProduct_(keyProducto) {
    return new Promise((resolve, reject) => {
      this.af
        .collection("productos")
        .doc(keyProducto)
        .delete()
        .then(function () {
          resolve({ success: true });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public getCroquisImg(idx) {
    this.areas = this.af.collection<any>("croquis_img", (ref) =>
      ref.where("idSucursal", "==", idx)
    );
    this._areas = this.areas.valueChanges();
    return (this._areas = this.areas.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getCartaSucursal(uidSucursal: string) {
    this.carta = this.af.collection<any>("cartas", (ref) =>
      ref.where("uidSucursal", "==", uidSucursal)
    );
    this._carta = this.carta.valueChanges();
    return (this._carta = this.carta.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  public getSucursal_() {
    this.sucursal = this.af.collection<any>("sucursales");
    this._sucursal = this.sucursal.valueChanges();
    return (this._sucursal = this.sucursal.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  obtenerMesas(id) {
    return new Promise((resolve, rejects) => {
      const url = `https://adminsoft.mx/operacion/guest/obtener_mesas/${id}`;
      this.http.get(url).subscribe((resp: any) => {
        const data = resp.consulta;
        resolve(data);
      });
    });
  }

  eliminar_rsvp(rsvp: string) {
    return new Promise((resolve, rejects) => {
      const data = {
        idReservacion: rsvp,
      };
      const url = `https://adminsoft.mx/operacion/guest/eliminar_rsvp/`;
      this.http.post(url, data).subscribe((resp: any) => {
        const data = resp.datos;
      });
    });
  }

  getCiudades() {
    return new Promise((resolve, rejects) => {
      this.af
        .collection("ciudades")
        .valueChanges()
        .subscribe((ciudades) => {
          resolve(ciudades);
        });
    });
  }

  getSucursalesTipo(tipo: string) {
    this.sucursal = this.af.collection<any>("sucursales", (ref) =>
      ref.where("tipo", "==", tipo)
    );
    this._sucursal = this.sucursal.valueChanges();
    return (this._sucursal = this.sucursal.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

  getSucursal(uidSucursal: string) {
    this.sucursal = this.af.collection<any>("sucursales", (ref) =>
      ref.where("uid", "==", uidSucursal)
    );
    this._sucursal = this.sucursal.valueChanges();
    return (this._sucursal = this.sucursal.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action: any) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }

}
