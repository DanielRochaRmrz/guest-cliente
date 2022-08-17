import { TarjetasPage } from './../tarjetas/tarjetas';
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
} from "ionic-angular";
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { MonitoreoReservasProvider } from "../../providers/monitoreo-reservas/monitoreo-reservas";
import { UserProvider } from "../../providers/user/user";
import { ToastController } from "ionic-angular";
import CryptoJS from "crypto-js";

@IonicPage()
@Component({
  selector: "page-generarqr-2",
  templateUrl: "generarqr-2.html",
})
export class Generarqr_2Page {
  uid: string;
  miUser: any = {};
  public telUser: string;
  public idReservacion: string = null;
  public total: string = null;
  public idUsuario: string = null;
  public tarjeta: string = null;
  tarjetaPagar: any;
  folio: any;
  cvc: number;
  payRes: boolean;
  msj: string;
  //Crear variables para guardar los datos que se reciban de la reservacion
  private created_code = null;
  private qr_data = {
    idReservacion: "",
    mensaje: "",
  };

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public servMon: MonitoreoReservasProvider,
    public usuarioProv: UsuarioProvider,
    public userProvider: UserProvider
  ) {} //termina constructor

  ionViewDidLoad() {
    console.log("ionViewDidLoad <Generarqr_2Page");
    //recibir datos de la reservacion normal
    this.idReservacion = this.navParams.get("idReservacion");
    this.total = this.navParams.get("total");
    this.idUsuario = this.navParams.get("idUsuario");
    this.folio = this.navParams.get("folio");
    this.cvc = this.navParams.get("cvc");
    this.getInfouser(this.idUsuario);
    this.payment();
  }

  async getInfouser(uid: string) {
    this.miUser = await this.userProvider.getUser(uid);
  }

  async payment() {
    //con id del usuario buscar su tarjeta registrada y activa para hacer el pago
    this.tarjetaPagar = await this.usuarioProv._getTarjetaPagar(this.idUsuario);

    console.log("Tarjeta -->", this.tarjetaPagar);

    let bytesNum = CryptoJS.AES.decrypt(
      this.tarjetaPagar.numTarjeta,
      "#C4rdGu35t"
    );
    const numTarjeta = bytesNum.toString(CryptoJS.enc.Utf8);
    let bytesMes = CryptoJS.AES.decrypt(
      this.tarjetaPagar.mesExpiracion,
      "#C4rdGu35t"
    );
    const mesExpiracion = bytesMes.toString(CryptoJS.enc.Utf8);
    let bytesAnio = CryptoJS.AES.decrypt(
      this.tarjetaPagar.anioExpiracion,
      "#C4rdGu35t"
    );
    const anioExpiracion = bytesAnio.toString(CryptoJS.enc.Utf8);

    const cvc = this.cvc;

    const montoReservacion = this.total;
    const folio = this.folio;
    console.log(
      "tarjeta pagar",
      numTarjeta,
      mesExpiracion,
      anioExpiracion,
      cvc,
      montoReservacion
    );
    const msj = await this.servMon.cambiaPagandoNormal(
      this.idReservacion,
      numTarjeta,
      mesExpiracion,
      anioExpiracion,
      cvc,
      montoReservacion,
      folio
    );

    this.msjAlert(msj);

    this.qr_data.idReservacion = this.idReservacion;
    this.qr_data.mensaje = "Reservacion pagada";
    this.created_code = JSON.stringify(this.qr_data);
  }

  msjAlert(msj: any) {
    console.log(msj.error);
    this.payRes = msj.payment;
    this.msj = msj.msj;
  }

  goPayment() {
    this.navCtrl.setRoot(TarjetasPage);
  }

  //funcion para regresar a la pagina anterior
  goBack() {
    this.navCtrl.setRoot(ReservacionDetallePage, {
      idReservacion: this.idReservacion,
    });
  }

  async getUsuario() {
    this.miUser = await this.userProvider.getUser(this.uid);
    this.telUser = this.miUser.phoneNumber;
  }
}
