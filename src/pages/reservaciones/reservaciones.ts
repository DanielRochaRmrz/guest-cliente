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
import { LoadingController } from 'ionic-angular';

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

  ports = [];
  port: Port;
  contactosSelec: any;
  telSelectMul: any = "";
  campo_evento: number;

  uidSucursal: string = "gbqtsea15rhu1BukxbekFEBohJv2";
  uidReservacion: string = "1IwVw10qn5CqlrSxpTEz";
  ClaveInstancia: string = '';
  personas: number = 3;
  fecha: string = '';
  hora: string = '';

  zona_consumo: number;
  loading: any;

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
    console.log(this.ClaveInstancia);
    this.evento = this.navParams.get("uid");
    this.idReservacion = this.navParams.get("idReservacion");
    this.zonasnav = this.navParams.get("zona");
    
    this.fecha = this.navParams.get('fecha');
    this.hora = this.navParams.get('hora');

    if (this.evento != null) {
      this.evento = this.navParams.get("uid");
      
    } else {
      this.evento = null;
    }
    this.afs
      .collection("sucursales")
      .doc(this.idSucursal)
      .valueChanges()
      .subscribe((data) => {
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
    this.fechaActual = new Date().toJSON().split("T")[0];
    this.getImagen(this.idSucursal);
    this.goToUser();
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
      });
    } else {
      this.navCtrl.popToRoot();
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
    for (var i = 0; i < this.telSelectMul.length; i++) {
      temp.push(this.telSelectMul[i].tel);
      this.compartir = temp;
    }
    const hora = moment(this.hora, ["h:mm A"]).format("HH:mm");
    let info = {
      numPersonas: this.people,
      hora: this.hora,
      fecha: this.fecha,
      idSucursal: this.idSucursal,
      idevento: this.evento,
    };
    this._providerReserva.saveReservacion(info).then((respuesta: any) => {
      // Si se compartio la cuenta insertar telefonos en tabla compartidas
      if (this.compartir != undefined) {
        this.afs.collection('users', ref => ref.where('uid', '==', this.uid)).valueChanges().subscribe(data => {
          this.usertel = data;
          this.usertel.forEach(element => {
            //insertar en tabla compartidas telefono del usuario en sesion
            this._providerReserva.saveCompartirPropio(element.phoneNumber, respuesta.idReservacion, this.uid, this.idSucursal, this.miUser.playerID).then((respuesta: any) => {});
          });
        });

        //sacar numeros que se seleccionan en el formulario compartir cuenta
        this.compartir.forEach(data => {
          //estandarizar telefonos 10 digitos
          
          this.telefono1 = data.replace(/ /g, "");
          this.telefono2 = this.telefono1.replace(/-/g, "");
          this.telefono3 = this.telefono2.substr(-10);
          //insertar en tabla compartidas los numeros de con quien se esta compartiendo
          this._providerReserva.saveCompartirTodos(this.telefono3, respuesta.idReservacion, this.uid, this.idSucursal).then((respuesta2: any) => {
            this.afs.collection('compartidas', ref => ref.where('idCompartir', '==', respuesta2.idCompartir)).valueChanges().subscribe(data => {
              this.resultCompartidas = data;
              //insertar el player id de cada telefono insertado
              this.resultCompartidas.forEach(element => {
                this._providerReserva.buscarPlayerid(element.telefono).subscribe(players => {
                  this.players = players[0].playerID;
                  console.log('players ID -->', this.players);
                  this.afs.collection("compartidas").doc(element.idCompartir).update({
                    "playerId": this.players
                  })
                    .then(function () {});
                });
              });
            });
          });
          //consulta para buscar el player id del ususario seleccionado y su tel
        });//termina foreach compartir
        //cambiar reservacion a estatus compartido
        this._providerReserva
          .updateReservacionCompartida(respuesta.idReservacion)
          .then((respuesta: any) => {
            if (respuesta.success == true) {}
          });
      }//termina funcion compartir cuenta insercion en tabla compartidas
      if (respuesta.success == true) {
        localStorage.setItem("idReservacion", respuesta.idReservacion);
        localStorage.setItem("idSucursal", this.idSucursal);
        localStorage.setItem("uidEvento", this.evento);
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

  reservacionUpdate(idReservacion) {
    const hora = moment(this.hora, ["h:mm A"]).format("HH:mm");
    let info = {
      numPersonas: this.people,
      hora: this.hora,
      fecha: this.fecha,
      idSucursal: this.idSucursal,
      idevento: this.evento
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
            zona_consumo: this.zona_consumo
        });
        }
      });
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
    this.loading = this.loadingCtrl.create({
      showBackdrop: true
    });
    this.loading.present();
    let alertMesas = this.alertCtrl.create({
      message: "<div text-center> <b> Al compartir una reservación estarás dividiendo la cuenta total entre los participantes de la reservación y todos deberán aceptar el compartirla para que sea aprobada por el rp/establecimiento. Al ser aceptada todos deberán pagar su parte para poder generar los códigos QR de acceso. </b> </div>",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {},
        },
      ],
    });
    alertMesas.present();
    setTimeout(() => {
      this.ports = [];
      this.todosContactos();
    }, 3000);
  }
  //Cargar todos los contactos del telefono
  todosContactos() {
    this.contacts
      .find(["displayName", "phoneNumbers"], { multiple: true })
      .then((contacts) => {
        this.contactlist = contacts;
        if (this.contactlist) {
          this.loading.dismiss();
        }
        const telefono3_ = [];
        //consulta para sacar contactos del telefono
        this.contactlist.forEach((data) => {
          //estandarizar telefono a 10 digitos
          //validar que si algun telefono es nulo no pase por la comparacion
          if (data.phoneNumbers != null) {
            this.telefono1 = data.phoneNumbers[0].value.replace(/ /g, "");
            this.telefono2 = this.telefono1.replace(/-/g, "");
            this.telefono3 = this.telefono2.substr(-10);
            if (this.platform.is('android')) {
              this.ports.push({ tel: this.telefono3, name: String(data.displayName) });
            }else{
              this.ports.push({ tel: this.telefono3, name: String(data.name.formatted) });
            }
          }
        }); //cierra funcion sacar contactos
        this.telefono4 = telefono3_;
  
      });
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

      // window["plugins"].OneSignal.postNotification(
      //   noti,
      //   function (successResponse) {},
      //   function (failedResponse: any) {}
      // );
    } else {}
  }
}

class Port {
  public tel: string;
  public name: string;
}
