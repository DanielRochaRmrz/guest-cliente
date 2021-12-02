import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ModalController,
  NavParams,
  AlertController
} from "ionic-angular";
//Firebase
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { ProductoDetallePage } from "../producto-detalle/producto-detalle";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { ResumenPage } from '../resumen/resumen';
import { CroquisPage } from "../croquis/croquis";

@IonicPage()
@Component({
  selector: "page-carta",
  templateUrl: "carta.html"
})
export class CartaPage {
  cartas = [];
  idReservacion: any;
  idSucursal: any;
  area: any;
  zona: any;
  hora: string = '';
  fecha: string = '';
  evento: any;
  consumo: any;
  productos: any;
  total: any;
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
    this.afs
      .collection("cartas")
      .valueChanges()
      .subscribe(c => {
        this.cartas = c;
        console.log("cartas", c);
      });
      this.afs
        .collection("sucursales")
        .valueChanges()
        .subscribe(s => {
          this.sucurSel = s;
          // console.log("sucursales", s);
        });
    //  this.cartas = afDB.list('bebidas').valueChanges();
    ///if (localStorage.getItem("idReservacion") != undefined) {
    ///    this.idReservacion = localStorage.getItem("idReservacion");
    ///}else{
    ///  this.idReservacion = navParam.get("idReservacion");
    ///}
    this.idReservacion = navParam.get("idReservacion");
    this.idSucursal = navParam.get("idSucursal");
    this.evento = navParam.get("uid");
    this.area = navParam.get("area");
    this.zona = navParam.get("zona");
    this.fecha = navParam.get('fecha');
    this.hora = navParam.get('hora');
    console.log("zona", this.zona, "area", this.area, "reservacion",this.idReservacion,"sucursal",this.idSucursal);
    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.uidUserSesion = localStorage.getItem('uid');
    console.log('id del usuario en eventos', this.uidUserSesion);
    console.log('evento id', this.evento);
     //obtener informacion de mi user
     this.afs
     .collection("users").doc(this.uidUserSesion)
     .valueChanges()
     .subscribe(dataSu => {
       this.miUser = dataSu;
       console.log('Datos de mi usuario', this.miUser);
     });

     //Obtener el nombre del evento
     if(this.evento != null){
         this.afs
        .collection("evento").doc(this.evento)
        .valueChanges()
        .subscribe(dataSu => {
          this.eventoSel = dataSu;
          console.log('Datos de mi evento', this.eventoSel);
        });
      }

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CartaPage");
    this.loadReservacion(this.idReservacion);
    this.loadProductRes(this.idReservacion);
  }

  goBack() {
    this.navCtrl.push(CroquisPage, {data: {
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      zona: this.zona,
      hora: this.hora,
      fecha: this.fecha
  }});
  }

  goToResumen(consumo, total) {
    console.log('Consumo: ', consumo, ' ', 'Total: ', total);

    const formatter = new Intl.NumberFormat("en-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2
    });
    if (total >= consumo) {
      this.navCtrl.push(ResumenPage, {
        idReservacion: this.idReservacion,
        idSucursal: this.idSucursal,
        uid: this.evento,
        area: this.area,
        zona: this.zona,
      });
    } else {
      let alertMesas = this.alertCtrl.create({
        message:
          "<div text-center> Esta zona cuenta con un consumo sugerido de " +
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
            }
          }
        ]
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
    });
  }

  loadReservacion(idx) {
    this._providerReserva.getReservacion(idx).subscribe(reservacion => {
      console.log('Datos Reservación: ', reservacion);
      this._getZona(reservacion.idZona);
    });
  }

  loadProductRes(idx) {
    this._providerReserva.getProductos(idx).subscribe(productos => {
      console.log("Datos Reservación: ", productos);
      this.productos = productos;
      this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);
      console.log('Resusltado: ', this.total);

    });
  }

  _getZona(idx) {
    this._providerReserva.getZona(idx).subscribe(zona => {
      console.log('Datos zona: ', zona);
      this.consumo = zona.consumo;
    });
  }
}
