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
import { MenuArbolPage } from '../menu-arbol/menu-arbol';
import { CartaApiProvider } from "../../providers/carta-api/carta-api";

@IonicPage()
@Component({
  selector: "page-carta",
  templateUrl: "carta.html",
})
export class CartaPage {
  cartas: any;
  idReservacion: any;
  idSucursal: any;
  ClaveInstancia: string = "";
  ClaveMenuDigitalDetalle: string = "";
  claveMenuDigitalDetalleArbol: string = "";
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
    public _providerReserva: ReservacionProvider,
    private cartaApi: CartaApiProvider
  ) {
    this.area = navParam.get("area");
    this.consumo = navParam.get("consumo");
    this.evento = navParam.get("uid");
    this.fecha = navParam.get("fecha");
    this.hora = navParam.get("hora");
    this.idReservacion = navParam.get("idReservacion");
    this.idSucursal = navParam.get("idSucursal");
    this.ClaveInstancia = navParam.get("ClaveInstancia");
    console.log(this.ClaveInstancia);
    this.ClaveMenuDigitalDetalle = navParam.get("ClaveMenuDigitalDetalle");
    console.log(this.ClaveMenuDigitalDetalle);
    this.claveMenuDigitalDetalleArbol = navParam.get("claveMenuDigitalDetalleArbol");
    console.log(this.claveMenuDigitalDetalleArbol);

    this.zona = navParam.get("zona");

    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");
    this.uidUserSesion = localStorage.getItem("uid");
    //obtener informacion de mi user
    this.afs
      .collection("users")
      .doc(this.uidUserSesion)
      .valueChanges()
      .subscribe((dataSu) => {
        this.miUser = dataSu;
      });
    //Obtener el nombre del evento
    if (this.evento != null) {
      this.afs
        .collection("evento")
        .doc(this.evento)
        .valueChanges()
        .subscribe((dataSu) => {
          this.eventoSel = dataSu;
        });
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CartaPage");
    this.loadSucursal(this.idSucursal);
    this.loadCartaSucursal(this.claveMenuDigitalDetalleArbol);
    this.loadProductRes(this.idReservacion);
  }

  loadCartaSucursal(claveMenuDigitalDetalleArbol: string) {
    this.cartaApi.GetProductosClasificacion(claveMenuDigitalDetalleArbol).subscribe((carta: any) => {
      this.cartas = carta;
    });
  }

  loadSucursal(idsucursal: string) {
    this._providerReserva.getSucursal(idsucursal).subscribe((sucursal: any) => {
      this.sucurSel = sucursal;
    })
  }

  goBack() {
    this.navCtrl.push(MenuArbolPage, {
        idReservacion: this.idReservacion,
        idSucursal: this.idSucursal,
        ClaveInstancia: this.ClaveInstancia,
        ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
        zona: this.zona,
        hora: this.hora,
        fecha: this.fecha,
        consumo: this.consumo,
    }, { animate: true, direction: "back" });
  }

  goToResumen(consumo: number, total: number) {

    const formatter = new Intl.NumberFormat("en-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });
    if (total >= consumo) {
      this.navCtrl.push(ResumenPage, {
        idReservacion: this.idReservacion,
        idSucursal: this.idSucursal,
        ClaveInstancia: this.ClaveInstancia,
        ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
        claveMenuDigitalDetalleArbol: this.claveMenuDigitalDetalleArbol,
        uid: this.evento,
        area: this.area,
        zona: this.zona,
        consumo: this.consumo,
        hora: this.hora,
        fecha: this.fecha,
      }, { animate: true, direction: "forward" });
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
            handler: () => {},
          },
        ],
      });
      alertMesas.present();
    }
  }

  productoDetalle(claveProducto: string) {
    this.navCtrl.push(ProductoDetallePage, {
      idReservacion: this.idReservacion,
      uid: this.evento,
      idSucursal: this.idSucursal,
      ClaveInstancia: this.ClaveInstancia,
      ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
      claveMenuDigitalDetalleArbol: this.claveMenuDigitalDetalleArbol,
      claveProducto: claveProducto,
      area: this.area,
      zona: this.zona,
      consumo: this.consumo,
      hora: this.hora,
      fecha: this.fecha,
    }, { animate: true, direction: "forward" } );
  }

  loadProductRes(idx) {
    this._providerReserva.getProductos(idx).subscribe((productos) => {
      console.log("Datos Reservación: ", productos);
      this.productos = productos;
      this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);
      console.log("Resusltado: ", this.total);
    });
  }
}
