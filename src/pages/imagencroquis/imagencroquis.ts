import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CargaCroquisProvider } from "../../providers/carga-croquis/carga-croquis";

@IonicPage()
@Component({
  selector: 'page-imagencroquis',
  templateUrl: 'imagencroquis.html',
})
export class ImagencroquisPage {

  imagenPreview : string ="";
  imagen64: string;
  idSucursal: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cap: CargaCroquisProvider) {

                this.idSucursal = navParams.get('idSucursal');
  }

  subirFoto(){

    let archivo = {
      plano: this.imagen64,
      key: this.idSucursal

    }

    this.cap.cargarImagen(archivo);
    // this.cerrarModal();

  }

}
