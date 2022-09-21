import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController, Platform } from 'ionic-angular';
import { MisReservacionesPage } from "../../pages/mis-reservaciones/mis-reservaciones";
import { GenerarqrPage } from "../../pages/generarqr/generarqr";
import { Generarqr_2Page } from "../../pages/generarqr-2/generarqr-2";
import { QrGeneradoPage } from "../../pages/qr-generado/qr-generado";
//importa provider donde se hacen las consultas
import { ReservacionProvider } from '../../providers/reservacion/reservacion';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from 'ionic-angular';
import { ModalTarjetasPage } from "../modal-tarjetas/modal-tarjetas";
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { UserProvider } from '../../providers/user/user';
import moment from "moment";
import { HistorialPage } from '../historial/historial';

@IonicPage()
@Component({
  selector: 'page-historial-detalle',
  templateUrl: 'historial-detalle.html',
})
export class HistorialDetallePage {

  listaProductos: any;
  idReservacion: any;
  mostrar: any;
  total: any;
  total2: any;
  total3: any;
  productos: any;
  infoReservaciones: any;
  infoReservaciones2: any;
  infoReservaciones3: any;
  nombresAreas: any;
  nombresZonas: any;
  listado: any;
  aleatorio: any;
  seleccion: any;
  idResrvacion: any;
  idUsuario: any;
  cuentasCompartidas: any;
  infoUsers: any;
  allContacts: any;
  compartidasAceptadas: any;
  tamano: any;
  resultadoCompartir: any;
  idUser: any;
  infoEspera: any;
  resultadoEspera: any;
  infoEsperaEstatus: any;
  resultadoEsperaEstatus: any;
  infoResEstatus: any;
  infoCupones: any;
  validarCupon: any;
  validarPropina: any;
  cuponExiste: any;
  cuponesDatos: any;
  propinaRe: any;
  propinaRe2: any;
  totalPropinaCupon: any;
  totalPropina: any;
  reservacionLugar: any;
  reservacionLugar2: any;
  nombreLugar: any;
  escaneo: any;
  modal: any;
  reservacionC: any;
  formatoFecha: any;
  reservacionFecha: any;
  miUser: any = {};
  idSucursal: any;
  mesas: any;
  soloTotal: any;
  tarjeta: any = [];
  countCompartidas: number = 0;
  countComPagadas: number = 0;
  nombreUsuarios: any;
  valorCupon: any;
  iva: number;
  comision: number;
  totalConPropina: any;
  totalNeto: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public reservaProvider: ReservacionProvider,
    public afDB: AngularFireDatabase,
    public alertCtrl: AlertController,
    public afs: AngularFirestore,
    public menu: MenuController,
    public platform: Platform,
    public toastCtrl: ToastController,
    private _providerReserva: ReservacionProvider,
    private _providerUserio: UsuarioProvider,
    private _providerUser: UserProvider
  ) {
    this.soloTotal = '';
    //recibe parametro de la reservacion
    this.idReservacion = this.navParams.get("idReservacion");
    this.modal = this.navParams.get("modal");
    //sacar el id del usuario guardado en el local storage
    this.idUser = localStorage.getItem('uid');
    this.idSucursal = localStorage.getItem('uidSucursal');

    //consultar tabla cupones
    this.afs
      .collection("cupones")
      .valueChanges()
      .subscribe(data4 => {
        this.infoCupones = data4;
        console.log("cupones", this.infoCupones);
      });

  }



  ionViewDidLoad() {

    this.menu.enable(true);
    const fecha = moment('2010-10-20').isBefore('2010-10-21'); // true
    console.log('Fecha --->', fecha);

    //carga funcion cuando abre la pagina
    this.getInfouser(this.idUser);
    this.getCompartidas(this.idReservacion);
    this.getDetails();
    this.mostrar = true;
    this.personaAcepta();
    this.compartidaEstatusFinal();
    this.verificarEscaneo();
    this.estatusPagando();
    this.obtenerMesas();
    this.getTarjeta(this.idUser);
    this.getCompatidasPagadas(this.idReservacion);
    this.loadUsersCompartidos(this.idReservacion);
  }

  async getInfouser(uid: string) {
    this.miUser = await this._providerUser.getUser(uid);
  }

  getCompartidas(idReservacion: string) {
    this._providerReserva.getCompartidaIdReserva(idReservacion).subscribe(data => {
      this.cuentasCompartidas = data;
    });
  }

  getTarjeta(uid: string) {
    this._providerUserio.getTarjetaPagar(uid).subscribe((data) => {
      this.tarjeta = data.length;
    });
  }

  getCompatidasPagadas(rsv: string) {
    this.reservaProvider.getCompartidaPagada(rsv).subscribe((data) => {
      this.countComPagadas = data.length;
      console.log('Pagadas -->', this.countComPagadas);
    });
  }

  loadUsersCompartidos(idReservacion: string) {
    this._providerReserva.getCompartidaAceptada(idReservacion).subscribe((dataCompartidas) => {
      const dataCom = dataCompartidas;
      dataCom.forEach((res: any) => {
        const telefono = res.telefono;
        const miTelefono = this.miUser.phoneNumber;
        if (telefono != miTelefono) {
          this._providerReserva.getTelefono(telefono).subscribe((dataUser: any) => {
            this.nombreUsuarios = [];
            dataUser.forEach((names: any) => {
              const displayName = names.displayName;
              this.nombreUsuarios.push(displayName);
            });
          });
        }
      });
    });
  }

  compartidaEstatusFinal() {
    //consultar ya ninguna persona esta en espera se cambia el estatus de la reservacion
    this.reservaProvider.consultarEstatusRe(this.idReservacion).subscribe(resEs => {
      this.infoResEstatus = resEs;
      console.log('Info espera resultado estatus', this.infoResEstatus[0].estatus);
      if (this.infoResEstatus[0].estatus == 'Compartida') {
        this.reservaProvider.consultarEspera(this.idReservacion).subscribe(infoEs => {
          this.infoEsperaEstatus = infoEs;
          console.log('Info espera resultado', this.infoEsperaEstatus);
          if (this.infoEsperaEstatus.length == 0) {
            this.resultadoEsperaEstatus = 'true';
            console.log('Ejecutar estatus final');
            this.reservaProvider.updateCreadaCompartida(this.idReservacion).then((respuestaCom: any) => {
              console.log("respuestaCom: ", respuestaCom);
            });
          } else {
            this.resultadoEsperaEstatus = 'false';
            console.log('NO Ejecutar estatus final');
          }
        });
      }
    });
  }

  getDetails() {
    // total de general dependiendo los productos que tenga la reservacion
    this.reservaProvider
      .getProductos(this.idReservacion)
      .subscribe((productos) => {

        this.productos = productos;

        this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);

        this.reservaProvider.getInfo(this.idReservacion).subscribe((info) => {

          this.infoReservaciones = info;

          if (info[0].uidCupon == undefined) {

            this.validarCupon = "Noexiste";

            this.propinaRe = this.total * info[0].propina;
            this.iva = this.total * .16;

            console.log("this.iva", this.iva);
            this.comision = this.total * .059;
            this.totalConPropina = this.total + this.propinaRe;
            this.totalNeto = (this.comision + this.iva) + this.totalConPropina;

          } else {

            //informacion de la reservacion seleccionada
            this.reservaProvider.getInfo(this.idReservacion).subscribe((info) => {

              this.infoReservaciones = info;
              this.idUser = localStorage.getItem("uid");

              this.validarCupon = "Existe";
              this.propinaRe2 = info[0].totalReservacion * info[0].propina;
              this.iva = info[0].totalReservacion * .16;
              console.log("this.iva", this.iva);

              this.comision = info[0].totalReservacion * .059;
              this.totalConPropina = info[0].totalReservacion + this.propinaRe2;
              this.totalNeto = (this.comision + this.iva) + this.totalConPropina;

            });
          }
        });

      });
    //consultar si exiente usuarios es espera de aceptar compartir la reservacion
    this.reservaProvider.consultarEspera(this.idReservacion).subscribe(infoE => {
      this.infoEspera = infoE;
      console.log('Info espera', this.infoEspera.length);
      if (this.infoEspera.length == 0) {
        this.resultadoEspera = 'true';
      }
      else {
        this.resultadoEspera = 'false';
      }
    });
  }


  personaAcepta() {
    //Consulta para revisar las personas que han aceptado compartir la reservacion
    this.reservaProvider.getCompartidaAceptada(this.idReservacion).subscribe(comAceptada => {
      const totalDividido = [];
      this.compartidasAceptadas = comAceptada;
      this.tamano = this.compartidasAceptadas.length;
      // total de la reservacion y dividirlo entre la persoas que han aceptado compartir
      this.reservaProvider.getProductos(this.idReservacion).subscribe(productos => {
        this.productos = productos;
        //informacion de la reservacion seleccionada saber si se uso cupon
        this.reservaProvider.getInfo(this.idReservacion).subscribe(info2 => {
          this.infoReservaciones2 = info2;
          //si el cupon no existe en la reservacion se hace la division normal
          if (info2[0].uidCupon == undefined) {
            this.total2 = this.productos.reduce((acc, obj) => acc + obj.total, 0);
            const propiCal = this.total2 * info2[0].propina;
            const totalPropin = this.total2 + propiCal;
            this.resultadoCompartir = totalPropin / this.tamano;
            totalDividido.push(this.resultadoCompartir);
            //asignar a cada persona que acepto compartir lo que le toca de la cuenta
            this.compartidasAceptadas.forEach(datacom => {
              this.reservaProvider.compartirDividido(datacom.idCompartir, this.resultadoCompartir).then((respuesta: any) => {
                console.log("Respuesta: ", respuesta);
              });
            });
          } else {
            //si el cupon existe en la reservacion se resta el descuento y se hace la division
            this.cuponExiste = info2[0].uidCupon;//sacar el uid del cupon
            //obtener el valor del cupon de acuerdo al uid
            this.afs.collection('cupones', ref => ref.where('uid', '==', this.cuponExiste)).valueChanges().subscribe(dataCu => {
              this.cuponesDatos = dataCu;
              this.valorCupon = this.cuponesDatos[0].valorCupon;
              console.log("este es el cupon usado", this.cuponesDatos[0].valorCupon);
              this.total2 = this.productos.reduce((acc, obj) => acc + obj.total, 0);
              this.total3 = this.total2 - this.cuponesDatos[0].valorCupon;
              const propiCal2 = this.total3 * info2[0].propina;
              const totalPropin2 = this.total3 + propiCal2;
              this.resultadoCompartir = totalPropin2 / this.tamano;
              totalDividido.push(this.resultadoCompartir);
              //asignar a cada persona que acepto compartir lo que le toca de la cuenta
              this.compartidasAceptadas.forEach(datacom => {
                this.reservaProvider.compartirDividido(datacom.idCompartir, this.resultadoCompartir).then((respuesta: any) => {
                  console.log("Respuesta: ", respuesta);
                });
              });
            });//termina info valor del cupon
          }//termina else
        });//termina info de reservacion seleccionada saber si se uso cupon
      });//termina total de productos
    });//termina saber personas que han aceptado compartir
  }//termina funcion principal

  //mandar datos a la pagina del QR
  genararQR(idReservacion, totalDividido, idUsuario, telefono, idCompartir, folio, displayNames) {
    const t = totalDividido + (totalDividido * .16) + (totalDividido * .059);
    const amount = (Number(t) * 100).toFixed(0);
    this.navCtrl.setRoot(GenerarqrPage, {
      idReservacion: idReservacion,
      totalDividido: amount,
      idUsuario: idUsuario,
      telefono: telefono,
      idCompartir: idCompartir,
      folio: folio,
      displayNames: displayNames
    });
  }

  genararQR_revisarTarjeta(idReservacion) {
    this.navCtrl.setRoot(ModalTarjetasPage, {
      idReservacion: idReservacion
    });
  }

  genararQR_Pagado(idReservacion, idCompartir) {
    this.navCtrl.setRoot(QrGeneradoPage, {
      idReservacion: idReservacion,
      idCompartir: idCompartir
    });
  }

  //mandar datos a la pagina del QR
  genararQRNormal(idReservacion, total, idUsuario, folio) {
    const t = total + (total * .16) + (total * .059);
    const amount = (Number(t) * 100).toFixed(0);
    this.navCtrl.setRoot(Generarqr_2Page, {
      idReservacion: idReservacion,
      total: amount,
      idUsuario: idUsuario,
      folio: folio
    });
  }
  genararQRNormal_revisarTarjeta(idReservacion) {
    this.navCtrl.setRoot(ModalTarjetasPage, {
      idReservacion: idReservacion
    });
    //let modal = this.modalCtrl.create("ModalTarjetasPage", {
    //  idReservacion: idReservacion,
    //});
    //modal.present();

  }

  goBack() {
    this.navCtrl.setRoot(MisReservacionesPage);
  }

  verificarEscaneo() {

    //obtener el nombre del lugar
    this.afs.collection('compartidas', ref => ref.where('idReservacion', '==', this.idReservacion)).valueChanges().subscribe(data10 => {
      this.countCompartidas = data10.length;
      this.reservacionC = data10;
      console.log("existe compartidas", this.reservacionC.length);
      if (this.reservacionC.length != 0) {
        // funcion para obtener qr escaneados
        this.reservaProvider.getEscaneos(this.idReservacion).subscribe(rEs => {
          this.escaneo = rEs;
          console.log("resultado escaneo", this.escaneo.length);
          if (this.escaneo.length == 0) {
            console.log('Cambia estatus principal');
            //CUNADO TODAS LAS PERSONAS QUE YA ESCANEARON SU QR SE  CAMBIA LA RESERVACION AL ESTATUS FINAL
            // this.afs.collection('reservaciones').doc(this.idReservacion).update({
            //   estatus: 'Finalizado'
            // });
          }
        });
      }
    });

  }

  //CAMBIAR A ESTATUS PAGANDO, SI ALGUNO NO LLEGO A LA RESERVACION, VALIDAR CON EL DIA, SI PASA DEL DIA SE CAMBIA A PAGANDO
  estatusPagando() {
    // OBTENER EL DIA ACTUAL (año-mes-dia->2019-11-30)
    var dateObj = new Date()
    var anio = dateObj.getFullYear().toString();
    var mes = dateObj.getMonth().toString();
    var dia = dateObj.getDate();
    var mesArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    if (dia >= 1 && dia <= 9) {
      var diaCero = '0' + dia;
      this.formatoFecha = anio + '-' + mesArray[mes] + '-' + diaCero;
    } else {
      this.formatoFecha = anio + '-' + mesArray[mes] + '-' + dia;
    }
    console.log("fechA ACTUAL", this.formatoFecha);
    //SABER SI LA RESERVACION EXISTE EN COMPARTIDAS O NO
    this.afs.collection('compartidas', ref => ref.where('idReservacion', '==', this.idReservacion)).valueChanges().subscribe(data11 => {
      this.reservacionC = data11;
      console.log("existe compartidas", this.reservacionC.length);
      //COMO EL RESULTADO ES DIFERENTE DE 0 QUIEDE DECIR QUE SI HAY RESERVACION EN COMPARTIDAS
      if (this.reservacionC.length != 0) {
        this.afs.collection('reservaciones', ref => ref.where('idReservacion', '==', this.idReservacion)).valueChanges().subscribe(data12 => {
          this.reservacionFecha = data12;
          //const fechaReservacion=data12[0].fechaR;
          this.reservacionFecha.forEach(element2 => {
            const fechaReservacion = element2.fechaR;
            console.log("fecha reservacion", fechaReservacion);
            if (this.formatoFecha > fechaReservacion) {
              //SI YA PASO LA FECHA DE LA RESERVACION SE CAMBIA EL ESTATUS PINCIPAL A PAGANDO POR SI ALGUIN NO LLEGO A ESCANEAR QR
              // this.afs.collection('reservaciones').doc(this.idReservacion).update({
              //   estatus: 'Finalizado'
              // });
              console.log("se cambio a pagando");
            }
          });
        });
      }
    });
  }


  eliminarReservacion(idReservacion, playerIDs) {
    this.eliminar_rsvp(idReservacion);
    // this.getUsersPusCancelar(playerIDs);

    // SE ELIMINA EL CODIGO DE RP USADO POR EL USUARIO

    this.eliminarCodigoRP(idReservacion);

    // SE ELIMINA RESERVACION

    this.afs.collection("reservaciones").doc(idReservacion).delete().then(() => {
      console.log("Document successfully deleted!");

      // this.showAlert();

      this.showToast('bottom');
      this.goBack();
    }).catch((error) => {
      // console.error("Error removing document: ", error);
    });

  }

  eliminarCodigoRP(idReservacion) {

    this.afs.collection("contCodigosRp").doc(idReservacion).delete().then(() => {

      console.log("Se borro regsitro en contCodigosRp");


    }).catch(function (error) {

      console.log("No se pudo en contCodigosRp");


    });

  }


  showAlert() {

    const alert = this.alertCtrl.create({
      title: 'Cancelado',
      subTitle: 'Se ha cancelado la reservación',
      buttons: ['OK']
    });

    alert.present();

  }

  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: 'Se ha cancelado la reservación',
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  goInicio() {
    this.navCtrl.setRoot(TipoLugarPage);
  }


  getUsersPusCancelar(playerIDs) {

    console.log("my PlayerID: ", playerIDs);
    if (this.platform.is("cordova")) {
      let noti = {
        app_id: "de05ee4f-03c8-4ff4-8ca9-c80c97c5c0d9",
        include_player_ids: [playerIDs],
        data: { foo: "bar" },
        contents: {
          en: " Reservación cancelada "
        }
      };

      // window["plugins"].OneSignal.postNotification(
      //   noti,
      //   function (successResponse) {
      //     console.log(
      //       "Notification Post Success:",
      //       successResponse
      //     );
      //   },
      //   function (failedResponse: any) {
      //     console.log("Notification Post Failed: ", failedResponse);
      //   }
      // );
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }


  behind() {
    this.navCtrl.setRoot(HistorialPage);
  }

  async obtenerMesas() {
    this.mesas = await this._providerReserva.obtenerMesas(this.idReservacion);
    console.log('Mesas -->', this.mesas);
  }

  async eliminar_rsvp(idReservacion) {
    const r = await this._providerReserva.eliminar_rsvp(idReservacion);
    console.log('RSVP -->', r);
  }

}
