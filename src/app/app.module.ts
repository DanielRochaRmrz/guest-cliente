import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicSelectableModule } from 'ionic-selectable';
//Paginas
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from "../pages/perfil/perfil";
import { EventosPage } from "../pages/eventos/eventos";
import { NosotrosPage } from "../pages/nosotros/nosotros";
import { CartaPage } from "../pages/carta/carta";
import { HistorialPage } from "../pages/historial/historial";
import { Reservacion_1Page } from "../pages/reservacion-1/reservacion-1";
import { TabsPage } from "../pages/tabs/tabs";
import { EventoDetallePage } from "../pages/evento-detalle/evento-detalle";
import { ReservacionesPage } from '../pages/reservaciones/reservaciones';
import { ProductoDetallePage } from "../pages/producto-detalle/producto-detalle";
import { ResumenPage } from "../pages/resumen/resumen";
import { ReservacionDetallePage } from "../pages/reservacion-detalle/reservacion-detalle";
import { CartaEditarPage } from "../pages/carta-editar/carta-editar";
import { ProductoDetalle_2Page } from "../pages/producto-detalle-2/producto-detalle-2";
import { TelefonoUserPage } from "../pages/telefono-user/telefono-user";
import { TarjetasPage } from '../pages/tarjetas/tarjetas';
import { AgregarTarjetaPage } from '../pages/agregar-tarjeta/agregar-tarjeta';
import { GenerarqrPage } from '../pages/generarqr/generarqr';
import { Generarqr_2Page } from "../pages/generarqr-2/generarqr-2";
import { CuponesPage } from "../pages/cupones/cupones";
import { PropinaPage } from "../pages/propina/propina";
import { QrGeneradoPage } from "../pages/qr-generado/qr-generado";
import { ModalTarjetasPage } from "../pages/modal-tarjetas/modal-tarjetas";
import { ModalTarjetasAddPage } from "../pages/modal-tarjetas-add/modal-tarjetas-add";
import { DetallePropinaPage } from "../pages/detalle-propina/detalle-propina";
import { MisReservacionesPage } from '../pages/mis-reservaciones/mis-reservaciones';
import { TipoLugarPage } from '../pages/tipo-lugar/tipo-lugar';
import { LoginCorreoPage } from '../pages/login-correo/login-correo';
import { SliderPage } from '../pages/slider/slider';
import { LoginTelefonoPage } from '../pages/login-telefono/login-telefono';
import { PerfilEditarPage } from '../pages/perfil-editar/perfil-editar';
import { CroquisPage } from '../pages/croquis/croquis';
import { MenuPage } from '../pages/menu/menu';
import { MenuArbolPage } from '../pages/menu-arbol/menu-arbol';

//administrador
import { ImagencroquisPage } from '../pages/imagencroquis/imagencroquis';

//Pipes
import { PipesModule } from "../pipes/pipes.module";

//Firebase
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore } from '@angular/fire/firestore';

//Provider
import { UsuarioProvider } from '../providers/usuario/usuario';
import { CargaArchivoProvider } from '../providers/carga-archivo/carga-archivo';
import { CartaAddProvider } from '../providers/carta-add/carta-add';
import { ToastProvider } from '../providers/toast/toast';
import { CargaArchivoCartaProvider } from '../providers/carga-archivo-carta/carga-archivo';
import { SucursalAltaProvider } from '../providers/sucursal-alta/sucursal-alta';
import { CargaCroquisProvider } from '../providers/carga-croquis/carga-croquis';
import { PushNotiProvider } from "../providers/push-noti/push-noti";
import { ReservacionProvider } from "../providers/reservacion/reservacion";
import { MonitoreoReservasProvider } from '../providers/monitoreo-reservas/monitoreo-reservas';
import { ResumenProvider } from '../providers/resumen/resumen';
import { CuponesProvider } from '../providers/cupones/cupones';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { CartaProvider } from '../providers/carta/carta';
import { GestionReservacionesProvider } from '../providers/gestion-reservaciones/gestion-reservaciones';
import { CroquisProvider } from '../providers/croquis/croquis';
import { DeviceProvider } from '../providers/device/device';
import { AppVersion } from '@ionic-native/app-version';
import { CartaApiProvider } from '../providers/carta-api/carta-api';

//Plugin
import { Facebook } from '@ionic-native/facebook';
import { SMS } from '@ionic-native/sms';
import { Contacts } from '@ionic-native/contacts';
// import { SocialSharing } from '@ionic-native/social-sharing';
import { HttpModule } from '@angular/http';
import { QRCodeModule } from 'angularx-qrcode';
import { Clipboard } from '@ionic-native/clipboard';
import { Stripe } from '@ionic-native/stripe';
import { Camera } from '@ionic-native/camera';
import { ZoomAreaModule } from 'ionic2-zoom-area';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoliticasPage } from '../pages/politicas/politicas';
import { LoginTelDatosPage } from '../pages/login-tel-datos/login-tel-datos';
import { HttpClientModule } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Device } from '@ionic-native/device';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { FCM } from '@ionic-native/fcm';
import firebase from "firebase/app";
import "firebase/firestore";;
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { HistorialDetallePage } from '../pages/historial-detalle/historial-detalle';
import { ScrollableDirective } from './scrollable.directive';
import { PaginationService } from './pagination.service';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner';
import { HistorialCompartidasPage } from '../pages/historial-compartidas/historial-compartidas';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import localeEsMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEsMX, 'es-MX');

var firebaseConfig = {
  apiKey: "AIzaSyBixlCb21nNbPSurY-Pvqu3hZB80Icl9Pk",
  authDomain: "guestreservation-8b24b.firebaseapp.com",
  databaseURL: "https://guestreservation-8b24b.firebaseio.com",
  projectId: "guestreservation-8b24b",
  storageBucket: "guestreservation-8b24b.appspot.com",
  messagingSenderId: "853477386824",
  appId: "1:853477386824:web:7fcd8b51df5c9c17b0867d",
  measurementId: "G-YLTR10V1M4"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage, 
    LoginPage,
    PerfilPage,
    TabsPage,
    EventosPage,
    Reservacion_1Page,
    NosotrosPage,
    CartaPage,
    HistorialPage,
    HistorialDetallePage,
    ProductoDetallePage,
    ResumenPage,
    EventoDetallePage,
    ImagencroquisPage,
    ReservacionesPage,
    MisReservacionesPage,
    ReservacionDetallePage,
    CartaEditarPage,
    ProductoDetalle_2Page,
    TelefonoUserPage,
    TarjetasPage,
    AgregarTarjetaPage,
    GenerarqrPage,
    Generarqr_2Page,
    CuponesPage,
    PropinaPage,
    QrGeneradoPage,
    TipoLugarPage,
    SliderPage,
    LoginCorreoPage,
    ModalTarjetasPage,
    ModalTarjetasAddPage,
    DetallePropinaPage,
    PoliticasPage,
    LoginTelefonoPage,
    LoginTelDatosPage,
    PerfilEditarPage,
    CroquisPage,
    MenuPage,
    MenuArbolPage,
    ScrollableDirective,
    LoadingSpinnerComponent,
    HistorialCompartidasPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ZoomAreaModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonText: ''
        }
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PipesModule,
    HttpModule,
    QRCodeModule,
    IonicSelectableModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, 
    LoginPage,
    PerfilPage,
    TabsPage,
    EventosPage,
    Reservacion_1Page,
    NosotrosPage,
    CartaPage,
    HistorialPage,
    HistorialDetallePage,
    ProductoDetallePage,
    ResumenPage,
    EventoDetallePage,
    ImagencroquisPage,
    ReservacionesPage,
    ReservacionesPage,
    MisReservacionesPage,
    ReservacionDetallePage,
    CartaEditarPage,
    ProductoDetalle_2Page,
    TelefonoUserPage,
    TarjetasPage,
    AgregarTarjetaPage,
    GenerarqrPage,
    Generarqr_2Page,
    CuponesPage,
    PropinaPage,
    QrGeneradoPage,
    TipoLugarPage,
    LoginCorreoPage,
    SliderPage,
    LoginCorreoPage,
    ModalTarjetasPage,
    ModalTarjetasAddPage,
    DetallePropinaPage,
    PoliticasPage,
    LoginTelefonoPage,
    LoginTelDatosPage,
    PerfilEditarPage,
    CroquisPage,
    MenuPage,
    MenuArbolPage,
    HistorialCompartidasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    ZoomAreaModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: LOCALE_ID, useValue: 'es-MX' },
    UsuarioProvider,
    Facebook,
    AuthProvider,
    UserProvider,
    Camera,
    CargaArchivoProvider,
    CartaAddProvider,
    ToastProvider,
    CargaArchivoCartaProvider,
    SucursalAltaProvider,
    CargaCroquisProvider,
    AngularFirestore,
    PushNotiProvider,
    Clipboard,
    ReservacionProvider,
    GestionReservacionesProvider,
    CartaProvider,
    MonitoreoReservasProvider,
    ResumenProvider,
    Contacts,
    SMS,
    CuponesProvider,
    Stripe,
    CroquisProvider,
    AndroidPermissions,
    Device,
    DeviceProvider,
    AppVersion,
    UniqueDeviceID,
    FCM,
    PhotoViewer,
    CartaApiProvider,
    PaginationService,
    InAppBrowser,
  ]
})
export class AppModule {}
