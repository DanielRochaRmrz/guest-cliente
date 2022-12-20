import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AlertController, ToastController } from "ionic-angular";
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { MonitoreoReservasProvider } from "../../providers/monitoreo-reservas/monitoreo-reservas";
import { UserProvider } from "../../providers/user/user";
import { TarjetasPage } from "../tarjetas/tarjetas";
import CryptoJS from "crypto-js";

@IonicPage()
@Component({
  selector: "page-generarqr",
  templateUrl: "generarqr.html",
})
export class GenerarqrPage {
  public idReservacion: string = null;
  public totalDividido: string = null;
  public idUsuario: string = null;
  public telefono: string = null;
  public tarjeta: string = null;
  public idSucursal: string;
  tarjetaPagar: any = {};
  usuarioID: any;
  idCompartir: any;
  folio: any;
  displayNames: any;
  cvc: number;
  miUser: any = {};
  payRes: boolean;
  msj: string;
  //Crear variables para guardar los datos que se reciban de la reservacion
  private created_code = null;
  private qr_data = {
    idReservacion: "",
    mensaje: "",
    idCompartir: "",
  };
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public servMon: MonitoreoReservasProvider,
    public usuarioProv: UsuarioProvider,
    public userProv: UserProvider
  ) {}

  //funcion para escanear los datos del QR

  ionViewDidLoad() {
    console.log("ionViewDidLoad GenerarqrPage");
    //recibir datos de la reservacion compartida
    this.idReservacion = this.navParams.get("idReservacion");
    this.totalDividido = this.navParams.get("totalDividido");
    this.idUsuario = this.navParams.get("idUsuario");
    this.telefono = this.navParams.get("telefono");
    this.idCompartir = this.navParams.get("idCompartir");
    this.idCompartir = this.navParams.get("idCompartir");
    this.folio = this.navParams.get("folio");
    this.displayNames = this.navParams.get("displayNames");
    this.cvc = this.navParams.get("cvc");
    this.idSucursal = this.navParams.get("idSucursal");
    this.getInfouser(this.idUsuario);
    this.payment();
  }

  async getInfouser(uid: string) {
    this.miUser = await this.userProv.getUser(uid);
  }

  async payment() {
    //obtener primero el id del usuario con el telefono recibido de la tabla compartidas
    //console.log('id del usuario por telefono',this.usuarioID);
    //obtenido el id del usuario buscar su tarjeta registrada y activa para hacer el pago
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

    const montoReservacion = this.totalDividido;
    const idCompartir = this.idCompartir;
    const folio = this.folio;

    const msj = await this.servMon.cambiaPagando(
      this.idReservacion,
      numTarjeta,
      mesExpiracion,
      anioExpiracion,
      cvc,
      montoReservacion,
      idCompartir,
      folio,
      this.displayNames
    );

    this.msjAlert(msj);
    //guardar datos recibidos en el arreglo creado qr_data
    this.qr_data.idReservacion = this.idReservacion;
    this.qr_data.mensaje = "Reservacion pagada";
    this.qr_data.idCompartir = this.idCompartir;
    this.created_code = JSON.stringify(this.qr_data);
  }

  msjAlert(msj: any) {
    this.payRes = msj.payment;
    this.msj = msj.msj;
  }

  goPayment() {
    this.navCtrl.setRoot(TarjetasPage);
  }

  goBack() {
    this.navCtrl.setRoot(ReservacionDetallePage, {
      idReservacion: this.idReservacion,
      idSucursal: this.idSucursal
    });
  }

  async getUsuario() {
    this.miUser = await this.userProv.getUser(this.idUsuario);
  }
}
