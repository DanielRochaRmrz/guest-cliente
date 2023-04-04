import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  Platform,
} from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
import { AngularFirestore } from "@angular/fire/firestore";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { Contacts } from "@ionic-native/contacts";
import { MonitoreoReservasProvider } from "../../providers/monitoreo-reservas/monitoreo-reservas";
import { IonicSelectableComponent } from "ionic-selectable";
import { CroquisPage } from "../croquis/croquis";
import moment from "moment";
import { LoadingController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-reservaciones",
  templateUrl: "reservaciones.html",
})
export class ReservacionesPage {
  idSucursal: any;
  sucursal: any = {};
  croquiss: any = {};
  croquis: any;
  arquitectura: any = {};
  myForm: FormGroup;
  data: any = {};
  areas: any;
  zonas: any;
  mesas: any;
  public ocultar: boolean = false;
  public areaKey: any;
  Sucursal: string = "reservar";
  area: any;
  zona: any;
  compartir: any;
  evento: any;
  people = 0;
  fechaActual: any;
  disabledFecha: boolean = false;
  disabledHora: boolean = false;
  idReservacion: any;
  contact = {
    displayName: null,
    phoneNumbers: null,
    birthday: null,
  };
  contactlist: any;
  telefono: any;
  telefono1: any;
  telefono2: any;
  telefono3: any;
  telefono4: any;
  telefono6: any;
  reservacion: any;
  uid: any;
  misTelefonos: any;
  clientes: any;
  dataUsers: any;
  telUser: any;
  players: any;
  compartirID: any;
  phoneuser: any;
  tabBarElement: any = "";
  zonasnav: string = "";
  img2 = [];
  resultCompartidas: any;
  usertel: any;
  resultCompartidasFinal: any;
  uidUserSesion: any;
  miUser: any = {};
  playerID: any;

  ports: Port[];
  port: Port[];
  selectedPorts: Port[];
  contactosSelec: any;
  telSelectMul: any = [];
  campo_evento: number;

  uidSucursal: string = "gbqtsea15rhu1BukxbekFEBohJv2";
  playerIDSuc: string = "";
  uidReservacion: string = "1IwVw10qn5CqlrSxpTEz";
  ClaveInstancia: string = "";
  personas: number = 3;
  fecha: string = "";
  hora: string = "";

  zona_consumo: number;
  loading: any;

  contactos: any[];
  selectContactos: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public afDB: AngularFireDatabase,
    public fb: FormBuilder,
    public _cap: CargaArchivoProvider,
    public _providerReserva: ReservacionProvider,
    public afs: AngularFirestore,
    private contacts: Contacts,
    public platform: Platform,
    public monRes: MonitoreoReservasProvider
  ) {
    this.idSucursal = this.navParams.get("idSucursal");
    this.ClaveInstancia = this.navParams.get("ClaveInstancia");
    this.playerIDSuc = this.navParams.get("playerIDSuc");
    this.idReservacion = this.navParams.get("idReservacion");
    this.zonasnav = this.navParams.get("zona");

    this.fecha = this.navParams.get("fecha");
    this.hora = this.navParams.get("hora");

    if (this.navParams.get("uidEvento") != null) {
      this.evento = this.navParams.get("uidEvento");
    } else if (localStorage.getItem("uidEvento")) {
      this.evento = localStorage.getItem("uidEvento");
    } else {
      this.evento = null;
    }

    this.afs
      .collection("sucursales")
      .doc(this.idSucursal)
      .valueChanges()
      .subscribe((data: any) => {
        this.sucursal = data;
      });

    this.afs
      .collection("croquis_img", (ref) =>
        ref.where("idSucursal", "==", this.idSucursal)
      )
      .valueChanges()
      .subscribe((data) => {
        this.croquis = data;
      });

    //consultar tabla users
    this.afs
      .collection("users")
      .valueChanges()
      .subscribe((datau) => {
        this.dataUsers = datau;
      });

    this.myForm = this.fb.group({
      hora: ["", [Validators.required]],
      fecha: ["", [Validators.required]],
      compartir: ["", []],
    });

    this.uid = localStorage.getItem("uid");

    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");

    const nombre = localStorage.getItem("nombre");
  }

  portChange(event: { component: IonicSelectableComponent; value: any }) {
    this.telSelectMul = event.value;
    localStorage.setItem("contactsSelected", JSON.stringify(this.telSelectMul));
  }

  ionViewDidLoad() {
    if (this.evento != null) {
      this.getDetails();
      this.disabledFecha = true;
      this.disabledHora = true;
    } else {
      this.disabledFecha = false;
      this.disabledHora = false;
    }

    if (this.idReservacion != null) {
      this.loadReservacion(this.idReservacion);
    }
    moment.locale('es-MX');
    this.fechaActual = moment().format('YYYY-MM-DD');
    console.log('fechaActual -->', new Date().toJSON().split("T")[0]);
    console.log('fechaActual -->', moment().format('YYYY-MM-DD'));
    this.getImagen(this.idSucursal);
    this.goToUser();
    if (this.platform.is("cordova")) {
      this.todosContactos();
    }
  }

  goBack(idReservacion) {
    if (this.idReservacion != null) {
      this.navCtrl.popToRoot().then(() => {
        this._providerReserva.deleteReservacion(idReservacion);
        localStorage.removeItem("idReservacion");
        localStorage.removeItem("idSucursal");
        localStorage.removeItem("uidEvento");
        localStorage.removeItem("reservacion");
        localStorage.removeItem("compartida");
        localStorage.removeItem("zona");
        localStorage.removeItem("contactosCompartidos");
        localStorage.removeItem("contactsSelected");
      });
    } else {
      this.navCtrl.popToRoot();
      localStorage.removeItem("idReservacion");
      localStorage.removeItem("idSucursal");
      localStorage.removeItem("uidEvento");
      localStorage.removeItem("reservacion");
      localStorage.removeItem("compartida");
      localStorage.removeItem("zona");
      localStorage.removeItem("contactosCompartidos");
      localStorage.removeItem("contactsSelected");
    }
  }

  goToUser() {
    //sacar el id del usuario del local storage
    this.uidUserSesion = localStorage.getItem("uid");

    //obtener informacion de mi user
    this.afs
      .collection("users")
      .doc(this.uidUserSesion)
      .valueChanges()
      .subscribe((dataSu) => {
        this.miUser = dataSu;
      });
  }

  getDetails() {
    this._cap.getEvento(this.evento).then((e) => {
      this.data = e;
    });
  }

  loadReservacion(idx) {
    this._providerReserva.getReservacion(idx).subscribe((reservacion) => {
      if (reservacion != null) {
        this.people = reservacion.numPersonas;
        this.hora = reservacion.hora;
        this.data.area = reservacion.idArea;
      }
    });
  }

  increment() {
    if (this.people < 20) {
      this.people++;
    }
  }

  decrement() {
    if (this.people > 0) {
      this.people--;
    }
  }

  reservacionAdd() {
    let temp = [];
    this.telSelectMul.forEach((data) => {
      temp.push(data.tel);
    });
    this.compartir = temp;

    const hora = moment(this.hora, ["h:mm A"]).format("HH:mm");
    
    let info = {
      numPersonas: this.people,
      hora: this.hora,
      fecha: this.fecha,
      idSucursal: this.idSucursal,
      playerIDSuc: this.playerIDSuc,
      idevento: this.evento,
      date_rserva: new Date(`${this.fecha} ${this.hora}`),
      estatus: "Creando",
    };
    this._providerReserva.saveReservacion(info).then((respuesta: any) => {
      // Si se compartio la cuenta insertar telefonos en tabla compartidas
      if (this.compartir != "") {
        this.addUserShare(respuesta.idReservacion);
      } //termina funcion compartir cuenta insercion en tabla compartidas
      if (respuesta.success == true) {
        localStorage.setItem("idReservacion", respuesta.idReservacion);
        localStorage.setItem("idSucursal", this.idSucursal);
        if (this.navParams.get("uidEvento")) {
          localStorage.setItem("uidEvento", this.evento);
        }
        localStorage.setItem("reservacion", "true");
        localStorage.setItem("zona", this.data.zona);

        this.navCtrl.push(CroquisPage, {
          idReservacion: respuesta.idReservacion,
          idSucursal: this.idSucursal,
          ClaveInstancia: this.ClaveInstancia,
          zona: this.zonasnav,
          hora: hora,
          fecha: this.fecha,
          zona_consumo: this.zona_consumo,
        });
      }
    });
  }

  addUserShare(idReservacion: string) {
    this.afs
      .collection("users", (ref) => ref.where("uid", "==", this.uid))
      .valueChanges()
      .subscribe((data) => {
        this.usertel = data;
        this.usertel.forEach((element) => {
          //insertar en tabla compartidas telefono del usuario en sesion
          this._providerReserva
            .saveCompartirPropio(
              element.phoneNumber,
              idReservacion,
              this.uid,
              this.idSucursal,
              this.miUser.playerID,
              this.fecha
            )
            .then((respuesta: any) => {});
        });
      });

    //sacar numeros que se seleccionan en el formulario compartir cuenta
    this.compartir.forEach((tel: any) => {
      //insertar en tabla compartidas los numeros de con quien se esta compartiendo
      this._providerReserva
        .saveCompartirTodos(tel, idReservacion, this.uid, this.idSucursal, this.fecha)
        .then((respuesta2: any) => {
          this.afs
            .collection("compartidas", (ref) =>
              ref.where("idCompartir", "==", respuesta2.idCompartir)
            )
            .valueChanges()
            .subscribe((data) => {
              this.resultCompartidas = data;
              //insertar el player id de cada telefono insertado
              this.resultCompartidas.forEach((element) => {
                this._providerReserva
                  .buscarPlayerid(element.telefono)
                  .subscribe((players) => {
                    console.log(players.length);
                    
                    if (!players.length) {
                      console.log("El array está vacío!");
                    } else {
                      this.players = players[0].playerID;
                      this.afs
                        .collection("compartidas")
                        .doc(element.idCompartir)
                        .update({
                          playerId: this.players,
                        })
                        .then(function () {}).catch((err) => {
                          // The document probably doesn't exist.
                          console.error("Error updating document: ", err);
                        });
                    }
                  });
              });
            });
        });
      //consulta para buscar el player id del ususario seleccionado y su tel
    }); //termina foreach compartir
    //cambiar reservacion a estatus compartido
    this._providerReserva
      .updateReservacionCompartida(idReservacion)
      .then((respuesta: any) => {
        if (respuesta.success == true) {
        }
      });
  }

  reservacionUpdate(idReservacion) {
    let temp = [];
    this.telSelectMul.forEach((data) => {
      temp.push(data.tel);
    });
    this.compartir = temp;

    console.log("COMPARTIR -->", this.compartir);

    // Si se compartio la cuenta insertar telefonos en tabla compartidas
    if (this.compartir.length) {
      this.updateUserShare(idReservacion);
      //termina funcion compartir cuenta insercion en tabla compartidas
    } else {
      const hora = moment(this.hora, ["h:mm A"]).format("HH:mm");
      let info = {
        numPersonas: this.people,
        hora: this.hora,
        fecha: this.fecha,
        idSucursal: this.idSucursal,
        idevento: this.evento,
        estatus: "Creando",
      };

      this._providerReserva
        .updateReservacion(idReservacion, info)
        .then((respuesta: any) => {
          if (respuesta.success == true) {
            localStorage.setItem("idReservacion", idReservacion);
            this.navCtrl.push(CroquisPage, {
              idReservacion: idReservacion,
              idSucursal: this.idSucursal,
              ClaveInstancia: this.ClaveInstancia,
              zona: this.zonasnav,
              hora: hora,
              fecha: this.fecha,
              zona_consumo: this.zona_consumo,
            });
          }
        });
    }
  }

  async updateUserShare(idReservacion: string) {
    const compartidaStatus = localStorage.getItem("compartida");
    if (!compartidaStatus) {
      this.afs
        .collection("users", (ref) => ref.where("uid", "==", this.uid))
        .valueChanges()
        .subscribe((data) => {
          this.usertel = data;
          this.usertel.forEach((element) => {
            //insertar en tabla compartidas telefono del usuario en sesion
            this._providerReserva
              .saveCompartirPropio(
                element.phoneNumber,
                idReservacion,
                this.uid,
                this.idSucursal,
                this.miUser.playerID,
                this.fecha
              )
              .then((respuesta: any) => {});
          });
        });
    }

    this.phoneSearch(idReservacion);

    this._providerReserva
      .updateReservacionCompartida(idReservacion)
      .then((respuesta: any) => {
        if (respuesta.success == true) {
        }
      });

    const hora = moment(this.hora, ["h:mm A"]).format("HH:mm");
    let info = {
      numPersonas: this.people,
      hora: this.hora,
      fecha: this.fecha,
      estatus: "Compartida",
      idSucursal: this.idSucursal,
      idevento: this.evento,
    };

    this._providerReserva
      .updateReservacion(idReservacion, info)
      .then((respuesta: any) => {
        if (respuesta.success == true) {
          localStorage.setItem("idReservacion", idReservacion);
          this.navCtrl.push(CroquisPage, {
            idReservacion: idReservacion,
            idSucursal: this.idSucursal,
            ClaveInstancia: this.ClaveInstancia,
            zona: this.zonasnav,
            hora: hora,
            fecha: this.fecha,
            zona_consumo: this.zona_consumo,
          });
        }
      });
  }

  async phoneSearch(idReservacion: string) {
    const telefonos: any =
      await this._providerReserva.getReservacionCompartidaUserTel(
        idReservacion
      );

    const selectedContacts = JSON.parse(
      localStorage.getItem("contactsSelected")
    );

    if (!selectedContacts.length) {
      localStorage.removeItem("compartida");
      localStorage.removeItem("contactosCompartidos");
      localStorage.removeItem("contactsSelected");
      this._providerReserva.updateReservacionNormal(idReservacion);
    }
    

    const telArr = [];
    telefonos.forEach((tlf) => {
      telArr.push(tlf.telefono);
    });

    const selectContArr = []
    selectedContacts.forEach(SelectTel => {
      selectContArr.push(SelectTel.tel);
    });

    const resDelete = telArr.filter(tel => selectContArr.indexOf(tel) === -1);

    const resAdd = selectContArr.filter(tel => telArr.indexOf(tel) === -1);

    const res = resDelete.concat(resAdd);
    if (!res.length) {
      console.log("El array está vacío!");
    } else {
      res.forEach(contacts => {
        console.log('Contactos delete -->', contacts);
        
        this._providerReserva.deleteUserSharedReserv(
          idReservacion,
          contacts,
          this.uid,
          this.idSucursal,
          this.fecha
        );
      })
    }
  }

  ocultarClic() {
    this.ocultar = !this.ocultar;
    this.checkActiveButton();
  }

  checkActiveButton() {
    if (this.ocultar) {
      this.ocultar = true;
    } else if (!this.ocultar) {
      this.ocultar = false;
    }
  }

  presentLoading() {
    let alertMesas = this.alertCtrl.create({
      message:
        "<div text-center> <b> Al compartir una reservación estarás dividiendo la cuenta total entre los participantes de la reservación y todos deberán aceptar el compartirla para que sea aprobada por el rp/establecimiento. Al ser aceptada todos deberán pagar su parte para poder generar los códigos QR de acceso. </b> </div>",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {},
        },
      ],
    });
    alertMesas.present();
  }

  //Cargar todos los contactos del telefono
  async todosContactos() {
    const contacts = await this.contacts.find(["displayName", "phoneNumbers"], {
      multiple: true,
      desiredFields: ["name", "phoneNumbers"],
    });
    const contactosArr = [];
    var count = 0;
    contacts.map((contact) => {
      const phoneContacts = contact.phoneNumbers;
      if (phoneContacts !== null) {
        const i = count++;
        const numPhone = String(contact.phoneNumbers[0].value);
        const telSinCaracteres = numPhone.replace(/[^a-zA-Z0-9]/g, "");
        const tel = telSinCaracteres.slice(-10);
        if (this.platform.is("android")) {
          contactosArr.push({
            tel: tel,
            name: String(contact.displayName + " - " + tel),
            index: i,
          });
        } else {
          contactosArr.push({
            tel: tel,
            name: String(contact.name.formatted + " - " + tel),
            index: i,
          });
        }
      }
    });
    this.contactos = contactosArr;

    const selectedContacts = JSON.parse(
      localStorage.getItem("contactsSelected")
    );
    if (selectedContacts) {
      console.log(selectedContacts);
      const pos = [];
      selectedContacts.forEach((c: any) => {
        pos.push(this.contactos[c.index]);
      });
      this.contactosSelec = pos;
    }
  }

  getImagen(idx) {
    this._providerReserva.getCroquisImg(idx).subscribe((res) => {
      this.img2 = res;
    });
  }

  getUsersPusCompartir() {
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
        include_player_ids: [this.miUser.playerID],
        data: { foo: "bar" },
        contents: {
          en: " Reservación compartida ",
        },
      };
    } else {
    }
  }
}

class Port {
  public tel: string;
  public name: string;
}
