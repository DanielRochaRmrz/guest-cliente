import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ReservacionDetallePage } from "../../pages/reservacion-detalle/reservacion-detalle";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { MonitoreoReservasProvider } from '../../providers/monitoreo-reservas/monitoreo-reservas';

@IonicPage()
@Component({
  selector: 'page-generarqr',
  templateUrl: 'generarqr.html',
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
  folio:any;
  displayNames: any;
  //Crear variables para guardar los datos que se reciban de la reservacion
  private created_code= null;
    private qr_data = {
    "idReservacion": "",
    "mensaje": "",
    "idCompartir": ""
   }
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public servMon: MonitoreoReservasProvider,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public usuarioProv: UsuarioProvider){

    //recibir datos de la reservacion compartida
    this.idReservacion = this.navParams.get("idReservacion");
    this.totalDividido = this.navParams.get("totalDividido");
    this.idUsuario = this.navParams.get("idUsuario");
    this.telefono = this.navParams.get("telefono");
    this.idCompartir = this.navParams.get("idCompartir");
    this.idCompartir = this.navParams.get("idCompartir");
    this.folio = this.navParams.get("folio");
    this.displayNames = this.navParams.get("displayNames");


    //obtener primero el id del usuario con el telefono recibido de la tabla compartidas
    this.usuarioProv.getUsuarioID(this.telefono).subscribe(user => {
      this.usuarioID = user[0].uid;
      //console.log('id del usuario por telefono',this.usuarioID);
      //obtenido el id del usuario buscar su tarjeta registrada y activa para hacer el pago
        this.usuarioProv.getTarjetaPagar(this.usuarioID).subscribe(pago => {
          //console.log('pago',pago.length);
          this.tarjetaPagar = pago[0].idTarjeta;
          const numTarjeta = pago[0].numTarjeta;
          const mesExpiracion = pago[0].mesExpiracion;
          const anioExpiracion = pago[0].anioExpiracion;
          const cvc = pago[0].cvc;
          const montoReservacion= this.totalDividido;
          const idCompartir=this.idCompartir;
          const folio = this.folio;
          console.log('tarjeta pagar',numTarjeta,mesExpiracion,anioExpiracion,cvc,montoReservacion,idCompartir);
          this.servMon.cambiaPagando(this.idReservacion,numTarjeta,mesExpiracion,anioExpiracion,cvc,montoReservacion,idCompartir,folio, this.displayNames);
          //guardar datos recibidos en el arreglo creado qr_data
          this.qr_data.idReservacion = this.idReservacion;
          this.qr_data.mensaje = "Reservacion pagada";
          this.qr_data.idCompartir = this.idCompartir;
          this.created_code = JSON.stringify(this.qr_data);
          //this.qr_data.telefono = this.telefono;
          //this.qr_data.tarjeta = this.tarjetaPagar;
        });
     });
    //obtener los datos del QR y sacarlo de uno por uno en la variable que manda el scanner
       //const dataCode = JSON.parse(this.created_code);
       //console.lo('dataCode: ', dataCode.idReservacion);
       //console.log('dataCode: ', dataCode.telefono);
       //console.log('dataCode: ', dataCode.totalDividido);
       //console.log('dataCode: ', dataCode.tarjeta);
  }


//funcion para escanear los datos del QR

  ionViewDidLoad() {
    console.log('ionViewDidLoad GenerarqrPage');
  }

  goBack() {
    this.navCtrl.setRoot(ReservacionDetallePage, {
      idReservacion: this.idReservacion
    });
  }

  //modalTarjetas(){
  //  let modal = this.modalCtrl.create("ModalTarjetasPage",{
  //     idReservacion: this.idReservacion,
  //   });
  //   modal.present();
  //}

}
