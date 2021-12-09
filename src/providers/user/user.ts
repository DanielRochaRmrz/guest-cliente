import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { Http, Headers, RequestOptions } from "@angular/http";
import { ToastController } from "ionic-angular";

@Injectable()
export class UserProvider {
  users: AngularFirestoreCollection<any[]>;
  _users: Observable<any>;
  uid: any;
  registro: any = "";

  constructor(
    public afireauth: AngularFireAuth,
    public afiredatabase: AngularFireDatabase,
    public afs: AngularFirestore,
    private http: Http,
    public toastCtrl: ToastController
  ) {
    console.log("Hello UserProvider Provider");
    afireauth.authState.subscribe((user) => {
      if (user) {
        const uidUser = user.uid;
        console.log("este es el uid de", uidUser);
        localStorage.setItem("uid", uidUser);
        localStorage.setItem("isLogin", "true");

        this.registro = localStorage.getItem("registroPhone");

        if (this.registro != null) {
          console.log("registro numerico:", this.registro);
          const ciudad = localStorage.getItem("ciudad");
          localStorage.setItem("phoneNumber", user.phoneNumber);
          this.userPhoneRegister(uidUser, user.phoneNumber, ciudad);
          localStorage.removeItem("ciudad");
          localStorage.removeItem("registroPhone");
          //localStorage.removeItem('uid');
          localStorage.removeItem("phoneNumber");
          this.registro = "";
        }
      }
    });
  }

  newRegister(newuser, uidSucursal) {
    this.afireauth.auth
      .createUserWithEmailAndPassword(newuser.email, newuser.password)
      .then((firebaseUser) => {
        this.uid = firebaseUser.user.uid;
        console.log("User " + this.uid + " created successfully!");
        this.register(newuser, uidSucursal);
      });
  }

  //registro al validar telefono
  userPhoneRegister(uid, phone, ciudad) {
    this.afs.collection("users").doc(uid).set({
      provider: "telefono",
      uid: uid,
      phoneNumber: phone,
      ciudad: ciudad,
      type: "u",
      active: "true",
      email: "",
      tarjeta: "",
      displayName: "",
    });
  }

  register(newuser, uidSucursal) {
    this.afs.collection("users").doc(this.uid).set({
      uid: this.uid,
      displayName: newuser.name,
      correo: newuser.email,
      type: newuser.type,
      active: "true",
      uidSucursal: uidSucursal,
      photoURL: "../assets/imgs/icons/profile.png",
    });
  }

  delete_user(uid) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    //
    const options = new RequestOptions({ headers: headers });
    const url = "https://guestreservation-8b24b.firebaseapp.com/delete";
    const data = JSON.stringify({
      uid: uid,
    });
    this.http.post(url, data, options).subscribe((res) => {
      console.log("El usuario se elimino de SDK");
    });
    // Eliminamos el usuario de la base de datos
    this.afs
      .collection("users")
      .doc(uid)
      .delete()
      .then(() => {
        this.mostrar_toast("Se elimino el empleado.");
        console.log("Se elimino el usuario de la base de datos");
      });
  }
  // Inhabilitar cuenta de empleado
  inhabilitar_user(uid) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    //
    const options = new RequestOptions({ headers: headers });
    const url = "https://guestreservation-8b24b.firebaseapp.com/inhabilitar";
    const data = JSON.stringify({
      uid: uid,
    });
    this.http.post(url, data, options).subscribe((res) => {
      console.log("El usuario se inhabilito del SDK");
    });
    // Actualizamos al usuario de la base de datos
    this.afs
      .collection("users")
      .doc(uid)
      .update({
        active: "false",
      })
      .then(() => {
        this.mostrar_toast("Se inhabilito al usuario.");
      });
  }
  // habilitar cuenta de empleado
  habilitar_user(uid) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    //
    const options = new RequestOptions({ headers: headers });
    const url = "https://guestreservation-8b24b.firebaseapp.com/habilitar";
    const data = JSON.stringify({
      uid: uid,
    });
    this.http.post(url, data, options).subscribe((res) => {
      console.log("El usuario se inhabilito del SDK");
    });
    // Actualizamos al usuario de la base de datos
    this.afs
      .collection("users")
      .doc(uid)
      .update({
        active: "true",
      })
      .then(() => {
        this.mostrar_toast("Se habilito al usuario.");
      });
  }

  idOneSignal(idx, playerID) {
    console.log("llegue a consultar insertar player");
    return new Promise((resolve, reject) => {
      this.afs
        .collection("users")
        .doc(idx)
        .update({
          playerID: playerID,
        })
        .then(function () {
          console.log("Document written with ID: ", idx);
          resolve({ success: true });
        })
        .catch(function (error) {
          console.error("Error adding document: ", JSON.stringify(error));
        });
    });
  }

  getAllUsers() {
    this.users = this.afs.collection<any>("users");
    this._users = this.users.valueChanges();

    return (this._users = this.users.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as any;
          data.$key = action.payload.doc.id;
          return data;
        });
      })
    ));
  }
  mostrar_toast(mensaje: string) {
    const toast = this.toastCtrl
      .create({
        message: mensaje,
        duration: 3000,
      })
      .present();
  }

  getUser(uid: string) {
    return new Promise((resolve, reject) => {
      this.afs
      .collection("users")
      .doc(uid).get()
      .subscribe((dataSu) => {
        resolve(dataSu.data());
      });
    });
  }

}
