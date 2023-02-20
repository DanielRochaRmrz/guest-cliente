import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

//Page
import { CartaPage } from '../carta/carta';

//Providers
import { CartaApiProvider } from "../../providers/carta-api/carta-api";
import { CroquisProvider } from "../../providers/croquis/croquis";
import { CroquisPage } from "../croquis/croquis";
import { MenuArbolPage } from '../menu-arbol/menu-arbol';

@IonicPage()
@Component({
  selector: "page-menu",
  templateUrl: "menu.html",
})
export class MenuPage {

  menus: any;
  uid: string = "";
  consumo: string = "";
  idSucursal: string = "";
  ClaveInstancia: string = "";
  fecha: string = "";
  hora: string = "";
  idReservacion: string = "";
  zona: string = "";
  miUser: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private croquisService: CroquisProvider,
    private cartaApi: CartaApiProvider,
  ) {}

  ionViewDidLoad() {
    this.uid = localStorage.getItem("uid");
    this.consumo = this.navParams.get("consumo");
    this.idSucursal = this.navParams.get("idSucursal");
    this.ClaveInstancia = this.navParams.get("ClaveInstancia");
    console.log(this.ClaveInstancia);
    this.fecha = this.navParams.get("fecha");
    this.hora = this.navParams.get("hora");
    this.idReservacion = this.navParams.get("idReservacion");
    this.zona = this.navParams.get("zona");
    this.user(this.uid);
    this.getMenu(this.ClaveInstancia);
  }

  async user(uid: string) {
    this.miUser = await this.croquisService.getUser(uid);
  }

  getMenu(ClaveInstancia: string) {
    this.cartaApi.getMenu(ClaveInstancia).subscribe((menus) => {
      this.menus = menus;
      console.log(this.menus.length);
      
    });
  }

  irCroquis() {
    this.navCtrl.push(CroquisPage, {
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      ClaveInstancia: this.ClaveInstancia,
      zona: this.zona,
      hora: this.hora,
      fecha: this.fecha,
      consumo: this.consumo,
    }, { animate: true, direction: "back" });
  }

  irMenuArbol(ClaveMenuDigitalDetalle: string) {
    this.navCtrl.push(MenuArbolPage, {
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      ClaveInstancia: this.ClaveInstancia,
      ClaveMenuDigitalDetalle: ClaveMenuDigitalDetalle,
      zona: this.zona,
      hora: this.hora,
      fecha: this.fecha,
      consumo: this.consumo,
    }, { animate: true, direction: "forward" });
  }

}
