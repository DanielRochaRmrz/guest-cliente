import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CartaApiProvider } from "../../providers/carta-api/carta-api";
import { CartaProvider } from "../../providers/carta/carta";
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { CartaPage } from "../carta/carta";

@IonicPage()
@Component({
  selector: "page-producto-detalle",
  templateUrl: "producto-detalle.html",
})
export class ProductoDetallePage {
  idProducto: any;
  product: any = {};
  pisto = 0;
  idReservacion: any;
  disableButton: any = true;
  evento: any;
  idSucursal: any;
  ClaveInstancia: string = "";
  ClaveMenuDigitalDetalle: string = "";
  claveMenuDigitalDetalleArbol: string = "";
  idSubmenu: string = "";
  claveProducto: string = "";
  productos: any;
  modificar: any;
  key: any;
  tabBarElement: any;
  area: any;
  zona: any;
  eventoSel: any = {};
  uidUserSesion: any;
  usuarios: any;
  miUser: any = {};
  sucurSel: any;
  consumo: number;
  fecha: string = "";
  hora: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afs: AngularFirestore,
    public _providerCarta: CartaProvider,
    public _providerReservacion: ReservacionProvider,
    public cartaApi: CartaApiProvider
  ) {
    this.afs
      .collection("sucursales")
      .valueChanges()
      .subscribe((s) => {
        this.sucurSel = s;
      });

    this.idProducto = navParams.get("idProducto");
    this.idReservacion = navParams.get("idReservacion");
    this.evento = navParams.get("uid");
    this.idSucursal = navParams.get("idSucursal");
    this.ClaveInstancia = navParams.get("ClaveInstancia");
    this.ClaveMenuDigitalDetalle = navParams.get("ClaveMenuDigitalDetalle");
    this.claveMenuDigitalDetalleArbol = navParams.get(
      "claveMenuDigitalDetalleArbol"
    );
    this.idSubmenu = navParams.get("idSubmenu");
    console.log(this.idSubmenu);
    this.claveProducto = navParams.get("claveProducto");
    this.area = navParams.get("area");
    this.zona = navParams.get("zona");
    this.consumo = navParams.get("consumo");
    this.fecha = navParams.get("fecha");
    this.hora = navParams.get("hora");
    //para ocultar las tabs en la pantalla de resumen
    this.tabBarElement = document.querySelector(".tabbar.show-tabbar");

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
    if (this.ClaveInstancia) {
      this.getProducto(this.ClaveInstancia, this.claveProducto);
    } else {
      this.getProductoGuest(this.claveProducto);
    }
    this.getProductoAdd(this.claveProducto, this.idReservacion);
  }

  getProducto(ClaveInstancia: string, claveProducto: string) {
    this.cartaApi
      .GetProducto(ClaveInstancia, claveProducto)
      .subscribe((producto: any) => {
        this.product = producto;
        console.log(this.product);
        
      });
  }

  getProductoGuest(claveProducto: string) {
    console.log(claveProducto);
    
    this.cartaApi
      .getOneProductGuest(claveProducto)
      .subscribe((producto: any) => {
        this.product = producto;
        console.log(this.product);
        
      });
  }

  getProductoAdd(claveProducto: string, idReservacion: string) {
    this._providerReservacion
      .getProductosAdd(claveProducto, idReservacion)
      .subscribe((productos) => {
        productos.map((item) => {
          this.modificar = true;
          this.pisto = item.cantidad;
          this.key = item.$key;
          console.log("Key -->", this.key);
        });
      });
  }

  increment() {
    if (this.pisto < 20) {
      this.pisto++;
    }
  }

  decrement() {
    if (this.pisto > 0) {
      this.pisto--;
    }
  }

  validarBoton() {
    if (this.pisto >= 1) {
      this.disableButton = false;
    } else {
      this.disableButton = true;
    }
  }

  agregar(nombreProducto: string, costo: number) {
    const total = costo * this.pisto;
    const producto = {
      cantidad: this.pisto,
      costo: costo,
      idProducto: this.claveProducto,
      idReservacion: this.idReservacion,
      img: "NA",
      producto: nombreProducto,
      total: total,
    };
    this._providerReservacion
      .addProducto(producto)
      .then((respuesta: any) => {
        if (respuesta.success == true) {
          this.navCtrl.push(
            CartaPage,
            {
              idReservacion: this.idReservacion,
              uid: this.evento,
              idSucursal: this.idSucursal,
              ClaveInstancia: this.ClaveInstancia,
              ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
              claveMenuDigitalDetalleArbol: this.claveMenuDigitalDetalleArbol,
              idSubmenu: this.idSubmenu,
              area: this.area,
              zona: this.zona,
              consumo: this.consumo,
              hora: this.hora,
              fecha: this.fecha,
            },
            { animate: true, direction: "back" }
          );
        } else {
        }
      })
      .catch();
  }

  modificar_(costo: number, key: string) {
    const total = costo * this.pisto;
    const producto = {
      cantidad: this.pisto,
      costo: costo,
      total: total,
    };
    this._providerReservacion
      .updateProducto(producto, key)
      .then((respuesta: any) => {
        if (respuesta.success == true) {
          this.navCtrl.push(
            CartaPage,
            {
              idReservacion: this.idReservacion,
              uid: this.evento,
              idSucursal: this.idSucursal,
              ClaveInstancia: this.ClaveInstancia,
              ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
              claveMenuDigitalDetalleArbol: this.claveMenuDigitalDetalleArbol,
              idSubmenu: this.idSubmenu,
              area: this.area,
              zona: this.zona,
              consumo: this.consumo,
              hora: this.hora,
              fecha: this.fecha,
            },
            { animate: true, direction: "back" }
          );
        } else {
        }
      })
      .catch();
  }

  eliminar(key) {
    this._providerReservacion.deleteProduct_(key).then((res: any) => {
      if (res.success == true) {
        this.navCtrl.push(
          CartaPage,
          {
            idReservacion: this.idReservacion,
            uid: this.evento,
            idSucursal: this.idSucursal,
            ClaveInstancia: this.ClaveInstancia,
            ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
            claveMenuDigitalDetalleArbol: this.claveMenuDigitalDetalleArbol,
            idSubmenu: this.idSubmenu,
            area: this.area,
            zona: this.zona,
            consumo: this.consumo,
            hora: this.hora,
            fecha: this.fecha,
          },
          { animate: true, direction: "back" }
        );
      } else {
      }
    });
  }

  goBack() {
    this.navCtrl.push(
      CartaPage,
      {
        idReservacion: this.idReservacion,
        uid: this.evento,
        idSucursal: this.idSucursal,
        ClaveInstancia: this.ClaveInstancia,
        ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
        claveMenuDigitalDetalleArbol: this.claveMenuDigitalDetalleArbol,
        idSubmenu: this.idSubmenu,
        area: this.area,
        zona: this.zona,
        consumo: this.consumo,
        hora: this.hora,
        fecha: this.fecha,
      },
      { animate: true, direction: "back" }
    );
  }
}
