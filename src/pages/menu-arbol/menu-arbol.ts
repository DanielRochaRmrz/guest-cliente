import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CroquisProvider } from "../../providers/croquis/croquis";
import { CartaPage } from "../carta/carta";
import { MenuPage } from "../menu/menu";
import { CartaApiProvider } from "../../providers/carta-api/carta-api";

@IonicPage()
@Component({
  selector: "page-menu-arbol",
  templateUrl: "menu-arbol.html",
})
export class MenuArbolPage {
  ArbolMenu: any;
  uid: string = "";
  consumo: string = "";
  idSucursal: string = "";
  ClaveInstancia: string = "";
  ClaveMenuDigitalDetalle: string = ""
  fecha: string = "";
  hora: string = "";
  idReservacion: string = "";
  zona: string = "";
  miUser: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private croquisService: CroquisProvider,
    private cartaApi: CartaApiProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad MenuArbolPage");
    this.uid = localStorage.getItem("uid");
    this.consumo = this.navParams.get("consumo");
    this.idSucursal = this.navParams.get("idSucursal");
    this.ClaveInstancia = this.navParams.get("ClaveInstancia");
    console.log(this.ClaveInstancia);
    this.ClaveMenuDigitalDetalle = this.navParams.get("ClaveMenuDigitalDetalle");
    console.log(this.ClaveMenuDigitalDetalle);
    this.fecha = this.navParams.get("fecha");
    this.hora = this.navParams.get("hora");
    this.idReservacion = this.navParams.get("idReservacion");
    this.zona = this.navParams.get("zona");
    this.user(this.uid);
    this.getArbolMenu(this.ClaveMenuDigitalDetalle);
  }

  async user(uid: string) {
    this.miUser = await this.croquisService.getUser(uid);
  }

  getArbolMenu(ClaveMenuDigitalDetalle: string) {
    this.cartaApi.GetArbolMenu(ClaveMenuDigitalDetalle).subscribe((Arbolmenu) => {
      console.log(Arbolmenu);

      this.ArbolMenu = Arbolmenu;
    });
  }

  irCata(claveMenuDigitalDetalleArbol: string) {
    this.navCtrl.push(CartaPage, {
      consumo: this.consumo,
      fecha: this.fecha,
      hora: this.hora,
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      ClaveInstancia: this.ClaveInstancia,
      ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
      claveMenuDigitalDetalleArbol: claveMenuDigitalDetalleArbol,
      zona: this.zona,
    }, { animate: true, direction: "back" });
  }

  irMenu() {
    this.navCtrl.push(MenuPage, {
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      ClaveInstancia: this.ClaveInstancia,
      ClaveMenuDigitalDetalle: this.ClaveMenuDigitalDetalle,
      zona: this.zona,
      hora: this.hora,
      fecha: this.fecha,
      consumo: this.consumo,
    }, { animate: true, direction: "forward" });
  }
}
