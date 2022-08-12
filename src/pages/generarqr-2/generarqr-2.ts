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
import { ToastController } from 'ionic-angular';

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
    //con id del usuario buscar su tarjeta registrada y activa para hacer el pago
    this.usuarioProv.getTarjetaPagar2(this.idUsuario).subscribe((pago) => {
      const prompt = this.alertCtrl.create({
        cssClass: "alert-input ",
        title: "C V V",
        message: "Ingresa el C V V de tu tarje credito/debito",
        inputs: [
          {
            name: "cvv",
            placeholder: "1234",
            type: "number",
          },
        ],
        buttons: [
          {
            text: "Declinar",
            handler: (data) => {
              console.log("Cancel clicked");
              this.goBack();
            },
          },
          {
            text: "Continuar",
            handler: (data) => {
              if( /^[0-9]{4}$/.test(data.cvv) || /^[0-9]{3}$/.test(data.cvv) ){
                console.log("Saved clicked", data);

                this.tarjetaPagar = pago[0].idTarjeta;
                const numTarjeta = pago[0].numTarjeta;
                const mesExpiracion = pago[0].mesExpiracion;
                const anioExpiracion = pago[0].anioExpiracion;
                const cvc = pago[0].cvc;
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
                this.servMon.cambiaPagandoNormal(
                  this.idReservacion,
                  numTarjeta,
                  mesExpiracion,
                  anioExpiracion,
                  cvc,
                  montoReservacion,
                  folio
                );
  
                this.qr_data.idReservacion = this.idReservacion;
                this.qr_data.mensaje = "Reservacion pagada";
                this.created_code = JSON.stringify(this.qr_data);
              } else {
                this.toastCtrl.create({
                  message: 'User was added successfully',
                  duration: 4000,
                  position: 'top'
                });
              }
            },
          },
        ],
      });
      prompt.present();
    });
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
