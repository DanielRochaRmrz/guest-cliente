import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
} from "ionic-angular";
import { AlertController, ToastController } from "ionic-angular";
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { MonitoreoReservasProvider } from "../../providers/monitoreo-reservas/monitoreo-reservas";
import { UserProvider } from "../../providers/user/user";

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
  tarjetaPagar: any;
  usuarioID: any;
  idCompartir: any;
  folio: any;
  displayNames: any;
  cvc: number;
  miUser: any = {};
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
    console.log("Tatejeta -->", this.tarjetaPagar);

    //console.log('pago',pago.length);
    this.tarjetaPagar = this.tarjetaPagar.idTarjeta;
    const numTarjeta = this.tarjetaPagar.numTarjeta;
    const mesExpiracion = this.tarjetaPagar.mesExpiracion;
    const anioExpiracion = this.tarjetaPagar.anioExpiracion;
    const cvc = this.cvc;
    const montoReservacion = this.totalDividido;
    const idCompartir = this.idCompartir;
    const folio = this.folio;
    console.log(
      "tarjeta pagar",
      numTarjeta,
      mesExpiracion,
      anioExpiracion,
      cvc,
      montoReservacion,
      idCompartir
    );
    this.servMon.cambiaPagando(
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
    //guardar datos recibidos en el arreglo creado qr_data
    this.qr_data.idReservacion = this.idReservacion;
    this.qr_data.mensaje = "Reservacion pagada";
    this.qr_data.idCompartir = this.idCompartir;
    this.created_code = JSON.stringify(this.qr_data);
    //this.qr_data.telefono = this.telefono;
    //this.qr_data.tarjeta = this.tarjetaPagar;
  }

  goBack() {
    this.navCtrl.setRoot(ReservacionDetallePage, {
      idReservacion: this.idReservacion,
    });
  }
  
  async getUsuario() {
    this.miUser = await this.userProv.getUser(this.idUsuario);
  }

}
