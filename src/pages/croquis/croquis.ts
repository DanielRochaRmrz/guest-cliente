import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
} from "ionic-angular";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { CartaPage } from "../carta/carta";
import { ReservacionesPage } from "../reservaciones/reservaciones";

import { CroquisProvider } from "../../providers/croquis/croquis";

@IonicPage()
@Component({
  selector: "page-croquis",
  templateUrl: "croquis.html",
})
export class CroquisPage {

  miUser: any = {};
  url: SafeResourceUrl;
  params: any = {};
  uid: string;
  showLoading: boolean = false;
  zonas: any;
  zona: string = "";
  zonaData: any = {};
  zonaForm: FormGroup;
  consumo: number;
  CroquisImg: string = '';
  imgCroquis: any = {};
  idSucursal: string = "";
  fecha: string = "";
  hora: string = "";
  idReservacion: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public croquisService: CroquisProvider,
    public formBuilder: FormBuilder,
    public photoViewer: PhotoViewer,
    private sanitizer: DomSanitizer
  ) {
    this.zonaForm = this.formBuilder.group({
      zona: ["", [Validators.required]],
    });
  }

  ionViewDidLoad() {
    this.showLoading = true;
    this.uid = localStorage.getItem("uid");
    this.user();
    this.idSucursal = this.navParams.get("idSucursal");
    this.fecha = this.navParams.get("fecha");
    this.hora = this.navParams.get("hora");
    this.idReservacion = this.navParams.get("idReservacion");
    this.zona = this.navParams.get("zona");
    this.getZonas(this.idSucursal);
    this.getCroquisImg(this.idSucursal);
    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
    //   `https://adminsoft.mx/operacion/login/cuadricula_cliente/${this.params.idSucursal}/${this.params.idReservacion}/${this.params.zona}/${this.params.zona_consumo}/${this.params.fecha}/${this.params.hora}`
    // );
  }

  async user() {
    this.miUser = await this.croquisService.getUser(this.uid);
  }

  getZonas(idSucursal: string) {
    this.croquisService.getZonas(idSucursal).subscribe((zonas) => {
      this.zonas = zonas;
    });
  }

  async getZona(e: string) {
    if (e) {
      this.zonaData = await this.croquisService.getZona(e);
      this.consumo = this.zonaData.consumo;
      this.alertConsumo(this.consumo);
    }
  }

  getCroquisImg (idSucursal: string) {
    this.croquisService.getCroquisImg(idSucursal).subscribe((dataImg) => {
      dataImg.forEach(data => {
        this.CroquisImg = data.imagenes;
        this.showLoading = false;
        console.log('Croquis -->', this.CroquisImg);
      });      
    });

  }

  showImagCroquis (CroquisImg: string) {
    this.photoViewer.show(CroquisImg, 'Croquis', {share: true});
  }

alertConsumo(consumo: number) {
    // "$1,000.00"
    const formatter = new Intl.NumberFormat("en-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });
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

  async updateZona() {
    const resultado = await this.croquisService.updateZona(this.idReservacion, this.zona);
    console.log('Update resultado -->', resultado);
    if (resultado == true) {
      this.irCata();
    }
  }

  irCata() {
    this.navCtrl.push(CartaPage, {
      consumo: this.consumo,
      fecha: this.fecha,
      hora: this.hora,
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      zona: this.zona,
    });
  }

  irReservaciones() {
    this.navCtrl.push(ReservacionesPage, {
      fecha: this.fecha,
      hora: this.hora,
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal,
      zona: this.zona,
    });
  }

  onLoad() {
    this.showLoading = false;
  }
}
