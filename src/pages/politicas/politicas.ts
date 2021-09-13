import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ResumenPage } from '../resumen/resumen';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';

/**
 * Generated class for the PoliticasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-politicas',
  templateUrl: 'politicas.html',
})
export class PoliticasPage {

  variable: any;

  constructor(public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams) {

    this.variable = this.navParams.get("variable");
    console.log("esta es la variable", this.variable);
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PoliticasPage');
  }

  addTerminos(){
    if(this.variable == 'resumen'){
      // this.navCtrl.setRoot(ResumenPage);
      this.viewCtrl.dismiss();
    } 
    if(this.variable == 'telefono'){
      this.navCtrl.setRoot(TipoLugarPage);
    }

  }

}
