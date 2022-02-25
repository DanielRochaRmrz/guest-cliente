import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  NavParams,
  AlertController,
} from "ionic-angular";
//Firebase
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { ProductoDetallePage } from "../producto-detalle/producto-detalle";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { ResumenPage } from "../resumen/resumen";
import { CroquisPage } from "../croquis/croquis";

@IonicPage()
@Component({
  selector: "page-carta",
  templateUrl: "carta.html",
})
export class CartaPage {
  cartas: any;
  idReservacion: any;
  idSucursal: any;
  area: any;
  zona: any;
  hora: string = "";
  fecha: string = "";
  evento: any;
  consumo: number;
  productos: any;
  total: number;
  tabBarElement: any;
  uidUserSesion: any;
  miUser: any = {};
  eventoSel: any = {};
  sucurSel: any;
  sucurName: any;

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    public alertCtrl: AlertController,
    public afDB: AngularFireDatabase,
    public afs: AngularFirestore,
    public modalCtrl: ModalController, //private _cap: CargaArchivoCartaProvider
    public _providerReserva: ReservacionProvider
  ) {
    this.area = navParam.get("area");
    this.consumo = navParam.get("consumo");
    console.log('Consumo -->', this.consumo);
    this.evento = navParam.get("uid");
    this.fecha = navParam.get("fecha");
    this.hora = navParam.get("hora");
    this.idReservacion = navParam.get("idReservacion");
    this.idSucursal = navParam.get("idSucursal");
    this.zona = navParam.get("zona");

    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
    this.uidUserSesion = localStorage.getItem("uid");
    console.log("id del usuario en eventos", this.uidUserSesion);
    console.log("evento id", this.evento);
    //obtener informacion de mi user
    this.afs
      .collection("users")
      .doc(this.uidUserSesion)
      .valueChanges()
      .subscribe((dataSu) => {
        this.miUser = dataSu;
        console.log("Datos de mi usuario", this.miUser);
      });
    //Obtener el nombre del evento
    if (this.evento != null) {
      this.afs
        .collection("evento")
        .doc(this.evento)
        .valueChanges()
        .subscribe((dataSu) => {
          this.eventoSel = dataSu;
          console.log("Datos de mi evento", this.eventoSel);
        });
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CartaPage");
    this.loadSucursal(this.idSucursal);
    this.loadCartaSucursal(this.idSucursal);
    this.loadReservacion(this.idReservacion);
    this.loadProductRes(this.idReservacion);
  }

  loadCartaSucursal(idSucursal: string) {
    this._providerReserva.getCartaSucursal(idSucursal).subscribe((carta: any) => {
      this.cartas = carta;
    });
  }

  loadSucursal(idsucursal: string) {
    this._providerReserva.getSucursal(idsucursal).subscribe((sucursal: any) => {
      this.sucurSel = sucursal;
    })
  }

  goBack() {
    this.navCtrl.push(CroquisPage, {
        idReservacion: this.idReservacion,
        idSucursal: this.idSucursal,
        zona: this.zona,
        hora: this.hora,
        fecha: this.fecha,
        consumo: this.consumo,
    });
  }

  goToResumen(consumo: number, total: number) {
    console.log("Consumo: ", consumo, " ", "Total: ", total);

    const formatter = new Intl.NumberFormat("en-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });
    if (total >= consumo) {
      this.navCtrl.push(ResumenPage, {
        idReservacion: this.idReservacion,
        idSucursal: this.idSucursal,
        uid: this.evento,
        area: this.area,
        zona: this.zona,
        consumo: this.consumo,
        hora: this.hora,
        fecha: this.fecha,
      });
    } else {
      let alertMesas = this.alertCtrl.create({
        title: "Consumo",
        message:
          "<div text-center> Esta zona cuenta con un consumo sugerido de: " +
          "<br><br>" +
          "<b>" +
          formatter.format(consumo) +
          "</b>" +
          "</div>",
        buttons: [
          {
            text: "Aceptar",
            handler: () => {
              console.log("Buy clicked");
            },
          },
        ],
      });
      alertMesas.present();
    }
  }

  productoDetalle(idProducto) {
    this.navCtrl.push(ProductoDetallePage, {
      idProducto: idProducto,
      idReservacion: this.idReservacion,
      uid: this.evento,
      idSucursal: this.idSucursal,
      area: this.area,
      zona: this.zona,
      consumo: this.consumo,
      hora: this.hora,
      fecha: this.fecha,
    });
  }

  loadReservacion(idx) {
    this._providerReserva.getReservacion(idx).subscribe((reservacion) => {
      // console.log("Datos Reservación: ", reservacion);
      // this._getZona(this.zona);
    });
  }

  loadProductRes(idx) {
    this._providerReserva.getProductos(idx).subscribe((productos) => {
      console.log("Datos Reservación: ", productos);
      this.productos = productos;
      this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);
      console.log("Resusltado: ", this.total);
    });
  }

  // async _getZona(idx) {
  //   const zona = await this._providerReserva.getZonaHttp(idx);
  //   console.log("esta es la sona -->", zona);
  //   this.consumo = zona[0].consumo;
  // }
}
