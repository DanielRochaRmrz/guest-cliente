import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  MenuController,
  ToastController,
  Platform,
} from "ionic-angular";
import { MisReservacionesPage } from "../../pages/mis-reservaciones/mis-reservaciones";
import { GenerarqrPage } from "../../pages/generarqr/generarqr";
import { Generarqr_2Page } from "../../pages/generarqr-2/generarqr-2";
import { QrGeneradoPage } from "../../pages/qr-generado/qr-generado";
//importa provider donde se hacen las consultas
import { ReservacionProvider } from "../../providers/reservacion/reservacion";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireDatabase } from "@angular/fire/database";
import { AlertController } from "ionic-angular";
import { TipoLugarPage } from "../tipo-lugar/tipo-lugar";
import { UsuarioProvider } from "../../providers/usuario/usuario";
import { UserProvider } from "../../providers/user/user";
import moment from "moment";
import { PushNotiProvider } from "../../providers/push-noti/push-noti";
import { TarjetasPage } from "../tarjetas/tarjetas";

@IonicPage()
@Component({
  selector: "page-reservacion-detalle",
  templateUrl: "reservacion-detalle.html",
})
export class ReservacionDetallePage {
  public listaProductos: any;
  public idReservacion: any;
  public mostrar: any;
  public total: any;
  public total2: any;
  public total3: any;
  public productos: any;
  public infoReservaciones: any;
  public infoR: any = {};
  public infoReservaciones2: any;
  public infoReservaciones3: any;
  public nombresAreas: any;
  public nombresZonas: any;
  public listado: any;
  public aleatorio: any;
  public seleccion: any;
  public idResrvacion: any;
  public idUsuario: any;
  public cuentasCompartidas: any;
  public infoUsers: any;
  public allContacts: any;
  public compartidasAceptadas: any;
  public tamano: any;
  public resultadoCompartir: any;
  public idUser: any;
  public infoEspera: any;
  public resultadoEspera: any;
  public infoEsperaEstatus: any;
  public resultadoEsperaEstatus: any;
  public infoResEstatus: any;
  public infoCupones: any;
  public validarCupon: any;
  public validarPropina: any;
  public cuponExiste: any;
  public cuponesDatos: any;
  public propinaRe: any;
  public propinaRe2: any;
  public totalPropinaCupon: any;
  public totalPropina: any;
  public reservacionLugar: any;
  public reservacionLugar2: any;
  public nombreLugar: any;
  public escaneo: any;
  public modal: any;
  public reservacionC: any;
  public formatoFecha: any;
  public reservacionFecha: any;
  public miUser: any = {};
  public idSucursal: any;
  public mesas: any;
  public soloTotal: any;
  public tarjeta: any = [];
  public countCompartidas: number = 0;
  public countComPagadas: number = 0;
  public nombreUsuarios: any;
  public tarjetaPagar: any = {};
  public valorCupon: any;
  public iva: any;
  public comision: number;
  public totalNeto: any;
  public totalConPropina: any;
  public subTotal: number;

  constructor(
    public navCtrl: NavController,
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
    private _providerUser: UserProvider,
    private _providerPushNoti: PushNotiProvider
  ) {
    this.soloTotal = "";
    //recibe parametro de la reservacion
    this.idReservacion = this.navParams.get("idReservacion");
    this.modal = this.navParams.get("modal");
    //sacar el id del usuario guardado en el local storage
    this.idUser = localStorage.getItem("uid");
    this.idSucursal = this.navParams.get("idSucursal");

    console.log("SUCURSAL GET ITEM ///", this.idSucursal);

    //consultar tabla cupones
    this.afs
      .collection("cupones")
      .valueChanges()
      .subscribe((data4) => {
        this.infoCupones = data4;
        console.log("cupones", this.infoCupones);
      });
  }

  ionViewDidLoad() {
    this.menu.enable(true);
    const fecha = moment("2010-10-20").isBefore("2010-10-21"); // true
    console.log("Fecha --->", fecha);

    //carga funcion cuando abre la pagina
    this.getDetails();
    this.getInfouser(this.idUser);
    this.getCompartidas(this.idReservacion);
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
    this._providerReserva
      .getCompartidaIdReserva(idReservacion)
      .subscribe((data) => {
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
      console.log("Pagadas -->", this.countComPagadas);
    });
  }

  loadUsersCompartidos(idReservacion: string) {
    this._providerReserva
      .getCompartidaAceptada(idReservacion)
      .subscribe((dataCompartidas) => {
        const dataCom = dataCompartidas;
        dataCom.forEach((res: any) => {
          const telefono = res.telefono;
          const miTelefono = this.miUser.phoneNumber;
          if (telefono != miTelefono) {
            this._providerReserva
              .getTelefono(telefono)
              .subscribe((dataUser: any) => {
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
    this.reservaProvider
      .consultarEstatusRe(this.idReservacion)
      .subscribe((resEs) => {
        this.infoResEstatus = resEs;
        console.log(
          "Info espera resultado estatus",
          this.infoResEstatus[0].estatus
        );
        if (this.infoResEstatus[0].estatus == "Compartida") {
          this.reservaProvider
            .consultarEspera(this.idReservacion)
            .subscribe((infoEs) => {
              this.infoEsperaEstatus = infoEs;
              console.log("Info espera resultado", this.infoEsperaEstatus);
              if (this.infoEsperaEstatus.length == 0) {
                this.resultadoEsperaEstatus = "true";
                console.log("Ejecutar estatus final");
                this.reservaProvider
                  .updateCreadaCompartida(this.idReservacion)
                  .then((respuestaCom: any) => {
                    console.log("respuestaCom: ", respuestaCom);
                  });
              } else {
                this.resultadoEsperaEstatus = "false";
                console.log("NO Ejecutar estatus final");
              }
            });
        }
      });
  }

  getDetails() {
    // total de general dependiendo los productos que tenga la reservacion
    this.reservaProvider
      .getProductos(this.idReservacion)
      .subscribe(async (productos) => {
        this.productos = productos;

        this.total = this.productos.reduce((acc, obj) => acc + obj.total, 0);

        this.infoReservaciones = await this.reservaProvider._getInfo(
          this.idReservacion
        );

        console.log("infoReservaciones", this.infoReservaciones.totalesR);

        // this.reservaProvider.getInfo(this.idReservacion).subscribe((info) => {
        //   this.infoReservaciones = info;

        if (this.infoReservaciones[0].uidCupon == undefined) {
          this.validarCupon = "Noexiste";

          this.comision = this.total * 0.059;

          this.subTotal = this.comision + this.total;

          this.iva = this.subTotal * 0.16;

          this.propinaRe = this.total * this.infoReservaciones[0].propina;

          this.totalNeto = this.subTotal + this.iva + this.propinaRe;

          const totales = {
            idReservacion: this.idReservacion,
            fechaR: this.infoReservaciones[0].fechaR,
            fechaR_: this.infoReservaciones[0].fechaR_,
            subTotal: this.total,
            comision: this.comision,
            iva: this.iva,
            propina: this.propinaRe,
            totalNeto: this.totalNeto,
            estatus: '',

          };

          // this.TotalesInsert(totales);
        } else {
          //informacion de la reservacion seleccionada
          // this.reservaProvider
          //   .getInfo(this.idReservacion)
          //   .subscribe((info: any) => {
          // this.infoReservaciones = info;
          this.idUser = localStorage.getItem("uid");

          this.validarCupon = "Existe";

          this.comision = this.infoReservaciones[0].totalReservacion * 0.059;

          this.subTotal =
            this.comision + this.infoReservaciones[0].totalReservacion;

          this.iva = this.subTotal * 0.16;

          this.propinaRe =
            this.infoReservaciones[0].totalReservacion *
            this.infoReservaciones[0].propina;

          this.totalNeto = this.subTotal + this.iva + this.propinaRe;

          const totales = {
            idReservacion: this.idReservacion,
            fechaR: this.infoReservaciones[0].fechaR,
            fechaR_: this.infoReservaciones[0].fechaR_,
            subTotal: this.total,
            comision: this.comision,
            iva: this.iva,
            propina: this.propinaRe,
            totalNeto: this.totalNeto,
          };

          // this.TotalesInsert(totales);

          // });
        }
        // });
      });

    //consultar si exiente usuarios es espera de aceptar compartir la reservacion
    this.reservaProvider
      .consultarEspera(this.idReservacion)
      .subscribe((infoE) => {
        this.infoEspera = infoE;
        console.log("Info espera", this.infoEspera.length);
        if (this.infoEspera.length == 0) {
          this.resultadoEspera = "true";
        } else {
          this.resultadoEspera = "false";
        }
      });
  }

  async TotalesInsert(totales: any) {
    const resp: any = await this.reservaProvider._getTotles(this.idReservacion);

    console.log("Respuesta totales ->", resp.length);

    if (resp.length == 0) {
      console.log("No hay totales");
      this.reservaProvider
        .saveTotales(totales)
        .then((resp: any) => console.log("respId -->", resp));
    } else {
      console.log("Ya hay totales");
    }
  }

  personaAcepta() {
    //Consulta para revisar las personas que han aceptado compartir la reservacion
    this.reservaProvider
      .getCompartidaAceptada(this.idReservacion)
      .subscribe((comAceptada) => {
        const totalDividido = [];
        this.compartidasAceptadas = comAceptada;
        this.tamano = this.compartidasAceptadas.length;
        // total de la reservacion y dividirlo entre la persoas que han aceptado compartir
        this.reservaProvider
          .getProductos(this.idReservacion)
          .subscribe((productos) => {
            this.productos = productos;
            //informacion de la reservacion seleccionada saber si se uso cupon
            this.reservaProvider
              .getInfo(this.idReservacion)
              .subscribe((info2) => {
                this.infoReservaciones2 = info2;
                //si el cupon no existe en la reservacion se hace la division normal
                if (info2[0].uidCupon == undefined) {
                  this.resultadoCompartir = this.totalNeto / this.tamano;

                  //asignar a cada persona que acepto compartir lo que le toca de la cuenta
                  this.compartidasAceptadas.forEach((datacom) => {
                    this.reservaProvider
                      .compartirDividido(
                        datacom.idCompartir,
                        this.resultadoCompartir
                      )
                      .then((respuesta: any) => {
                        console.log("Respuesta: ", respuesta);
                      });
                  });
                } else {
                  //si el cupon existe en la reservacion se resta el descuento y se hace la division
                  this.cuponExiste = info2[0].uidCupon; //sacar el uid del cupon
                  //obtener el valor del cupon de acuerdo al uid
                  this.afs
                    .collection("cupones", (ref) =>
                      ref.where("uid", "==", this.cuponExiste)
                    )
                    .valueChanges()
                    .subscribe((dataCu) => {
                      this.cuponesDatos = dataCu;
                      this.valorCupon = this.cuponesDatos[0].valorCupon;
                      // console.log(
                      //   "este es el cupon usado",
                      //   this.cuponesDatos[0].valorCupon
                      // );
                      // this.total2 = this.productos.reduce(
                      //   (acc, obj) => acc + obj.total,
                      //   0
                      // );
                      // this.total3 =
                      //   this.total2 - this.cuponesDatos[0].valorCupon;
                      // const propiCal2 = this.total3 * info2[0].propina;
                      // const totalPropin2 = this.total3 + propiCal2;
                      this.resultadoCompartir = this.totalNeto / this.tamano;
                      console.log(
                        "resultadoCompartir",
                        this.resultadoCompartir
                      );
                      console.log("tamano", this.tamano);

                      // totalDividido.push(this.resultadoCompartir);
                      //asignar a cada persona que acepto compartir lo que le toca de la cuenta
                      this.compartidasAceptadas.forEach((datacom) => {
                        this.reservaProvider
                          .compartirDividido(
                            datacom.idCompartir,
                            this.resultadoCompartir
                          )
                          .then((respuesta: any) => {
                            console.log("Respuesta: ", respuesta);
                          });
                      });
                    }); //termina info valor del cupon
                } //termina else
              }); //termina info de reservacion seleccionada saber si se uso cupon
          }); //termina total de productos
      }); //termina saber personas que han aceptado compartir
  } //termina funcion principal

  //mandar datos a la pagina del QR
  async genararQR(
    idReservacion,
    totalDividido,
    idUsuario,
    telefono,
    idCompartir,
    folio,
    displayNames
  ) {
    this.tarjetaPagar = await this._providerUserio._getTarjetaPagar(idUsuario);
    console.log("Tatejeta -->", this.tarjetaPagar);

    const prompt = this.alertCtrl.create({
      cssClass: "alert-input",
      title: "cvc",
      message: `Ingresa el cvc de tu tarje credito/debito con la terminación <b> **** ${this.tarjetaPagar.numTarjeta4dijitos} </b>`,
      inputs: [
        {
          name: "cvc",
          placeholder: "1234",
          type: "number",
        },
      ],
      buttons: [
        {
          text: "Declinar",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Continuar",
          handler: (data) => {
            if (data.cvc == "") {
              let toastError = this.toastCtrl.create({
                message: "El cvc es requerido",
                duration: 5000,
                position: "top",
              });
              toastError.onDidDismiss(() => {
                console.log("Dismissed toast");
              });

              toastError.present();
              return false;
            }
            if (/^[0-9]{3,4}$/.test(data.cvc)) {
              console.log("Saved clicked", data);

              const amount = (Number(totalDividido) * 100).toFixed(0);
              this.navCtrl.setRoot(GenerarqrPage, {
                idReservacion: idReservacion,
                totalDividido: amount,
                cvc: data.cvc,
                idUsuario: idUsuario,
                telefono: telefono,
                idCompartir: idCompartir,
                folio: folio,
                displayNames: displayNames,
              });
            } else {
              let toastError = this.toastCtrl.create({
                message:
                  "Formato de cvc incorrecto, debe contener de 3 a 4 digitos",
                duration: 5000,
                position: "top",
              });
              toastError.onDidDismiss(() => {
                console.log("Dismissed toast");
              });

              toastError.present();
              return false;
            }
          },
        },
      ],
    });
    prompt.present();
  }

  genararQR_revisarTarjeta() {
    let alert = this.alertCtrl.create({
      title: "Tarjeta debito/credito",
      message:
        "No cuentas con tarjetas registradas para realizar el cobro de tu reservación",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Registrar tarjeta",
          handler: () => {
            console.log("Buy clicked");
            this.navCtrl.setRoot(TarjetasPage);
          },
        },
      ],
    });
    alert.present();
  }

  genararQR_Pagado(idReservacion, idCompartir) {
    this.navCtrl.setRoot(QrGeneradoPage, {
      idReservacion: idReservacion,
      idCompartir: idCompartir,
    });
  }

  //mandar datos a la pagina del QR
  async genararQRNormal(idReservacion, total, idUsuario, folio) {
    this.tarjetaPagar = await this._providerUserio._getTarjetaPagar(idUsuario);
    console.log("Tatejeta -->", this.tarjetaPagar);

    const prompt = this.alertCtrl.create({
      cssClass: "alert-input",
      title: "cvc",
      message: `Ingresa el cvc de tu tarje credito/debito con la terminación <b> **** ${this.tarjetaPagar.numTarjeta4dijitos} </b>`,
      inputs: [
        {
          name: "cvc",
          placeholder: "1234",
          type: "number",
        },
      ],
      buttons: [
        {
          text: "Declinar",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Continuar",
          handler: (data) => {
            if (data.cvc == "") {
              let toastError = this.toastCtrl.create({
                message: "El cvc es requerido",
                duration: 5000,
                position: "top",
              });
              toastError.onDidDismiss(() => {
                console.log("Dismissed toast");
              });

              toastError.present();
              return false;
            }
            if (/^[0-9]{3,4}$/.test(data.cvc)) {
              console.log("Saved clicked", data);

              const amount = (Number(total) * 100).toFixed(0);
              this.navCtrl.setRoot(Generarqr_2Page, {
                idReservacion: idReservacion,
                total: amount,
                cvc: data.cvc,
                idUsuario: idUsuario,
                folio: folio,
              });
            } else {
              let toastError = this.toastCtrl.create({
                message:
                  "Formato de cvc incorrecto, debe contener de 3 a 4 digitos",
                duration: 5000,
                position: "top",
              });
              toastError.onDidDismiss(() => {
                console.log("Dismissed toast");
              });

              toastError.present();
              return false;
            }
          },
        },
      ],
    });
    prompt.present();
  }

  genararQRNormal_revisarTarjeta(idReservacion) {
    let alert = this.alertCtrl.create({
      title: "Tarjeta debito/credito",
      message:
        "No cuentas con tarjetas registradas para realizar el cobro de tu reservación",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Registrar tarjeta",
          handler: () => {
            console.log("Buy clicked");
            this.navCtrl.setRoot(TarjetasPage);
          },
        },
      ],
    });
    alert.present();
  }

  goBack() {
    this.navCtrl.setRoot(MisReservacionesPage);
  }

  verificarEscaneo() {
    //obtener el nombre del lugar
    this.afs
      .collection("compartidas", (ref) =>
        ref.where("idReservacion", "==", this.idReservacion)
      )
      .valueChanges()
      .subscribe((data10) => {
        this.countCompartidas = data10.length;
        this.reservacionC = data10;
        console.log("existe compartidas", this.reservacionC.length);
        if (this.reservacionC.length != 0) {
          // funcion para obtener qr escaneados
          this.reservaProvider
            .getEscaneos(this.idReservacion)
            .subscribe((rEs) => {
              this.escaneo = rEs;
              console.log("resultado escaneo", this.escaneo.length);
              if (this.escaneo.length == 0) {
                console.log("Cambia estatus principal");
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
    var dateObj = new Date();
    var anio = dateObj.getFullYear().toString();
    var mes = dateObj.getMonth().toString();
    var dia = dateObj.getDate();
    var mesArray = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    if (dia >= 1 && dia <= 9) {
      var diaCero = "0" + dia;
      this.formatoFecha = anio + "-" + mesArray[mes] + "-" + diaCero;
    } else {
      this.formatoFecha = anio + "-" + mesArray[mes] + "-" + dia;
    }
    console.log("fechA ACTUAL", this.formatoFecha);
    //SABER SI LA RESERVACION EXISTE EN COMPARTIDAS O NO
    this.afs
      .collection("compartidas", (ref) =>
        ref.where("idReservacion", "==", this.idReservacion)
      )
      .valueChanges()
      .subscribe((data11) => {
        this.reservacionC = data11;
        console.log("existe compartidas", this.reservacionC.length);
        //COMO EL RESULTADO ES DIFERENTE DE 0 QUIEDE DECIR QUE SI HAY RESERVACION EN COMPARTIDAS
        if (this.reservacionC.length != 0) {
          this.afs
            .collection("reservaciones", (ref) =>
              ref.where("idReservacion", "==", this.idReservacion)
            )
            .valueChanges()
            .subscribe((data12) => {
              this.reservacionFecha = data12;
              //const fechaReservacion=data12[0].fechaR;
              this.reservacionFecha.forEach((element2) => {
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

  eliminarReservacion(
    idReservacion: string,
    folio: string,
    playerIDSuc: string
  ) {
    // this.getUsersPusCancelar(playerIDs);

    // SE ELIMINA EL CODIGO DE RP USADO POR EL USUARIO

    this.eliminarCodigoRP(idReservacion);

    // SE ELIMINA RESERVACION

    this.afs
      .collection("reservaciones")
      .doc(idReservacion)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        this.reservaProvider.deleteCompartida(idReservacion);
        this._providerPushNoti.PushNotiCancelarReserva(folio, playerIDSuc);
        // this.showAlert();

        this.showToast("bottom");
        this.goBack();
      })
      .catch((error) => {
        // console.error("Error removing document: ", error);
      });
  }

  eliminarCodigoRP(idReservacion) {
    this.afs
      .collection("contCodigosRp")
      .doc(idReservacion)
      .delete()
      .then(() => {
        console.log("Se borro regsitro en contCodigosRp");
      })
      .catch(function (error) {
        console.log("No se pudo en contCodigosRp");
      });
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Cancelado",
      subTitle: "Se ha cancelado la reservación",
      buttons: ["OK"],
    });

    alert.present();
  }

  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: "Se ha cancelado la reservación",
      duration: 2000,
      position: position,
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
          en: " Reservación cancelada ",
        },
      };
    } else {
      console.log("Solo funciona en dispositivos");
    }
  }

  behind() {
    this.navCtrl.setRoot(MisReservacionesPage);
  }

  async obtenerMesas() {
    this.mesas = await this._providerReserva.obtenerMesas(this.idReservacion);
    console.log("Mesas -->", this.mesas);
  }
}
