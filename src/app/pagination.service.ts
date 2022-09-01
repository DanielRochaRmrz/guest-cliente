import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import { LoadingController } from 'ionic-angular';

interface QueryConfig {
  path: string, //  path to collection
  field: string, // field to orderBy
  limit: number, // limit per query
  reverse: boolean, // reverse order?
  prepend: boolean // prepend to source?
  donde: string;
}


@Injectable()
export class PaginationService {

  formatoFecha: any;

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);
  private loadingDatos: any;
  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();


  constructor(private afs: AngularFirestore, public loadingCtrl: LoadingController,) { }

  get fechaEventos() {

    // eventos de fecha actual y que se quiten de fechas pasadas (año-mes-dia->2019-11-30)
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

    return this.formatoFecha;

  }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {
    this.presentLoading();
    this.query = {
      path,
      field,
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    }

    var first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .where("fecha", ">=", this.fechaEventos)

    })

    if (first) {
      this.loadingDatos.dismiss();
      this.mapAndUpdate(first)

      // Create the observable array for consumption in components
      this.data = this._data.asObservable()
        .scan((acc, val) => {
          return this.query.prepend ? val.concat(acc) : acc.concat(val)
        })
    }

  }

  initSucursales(path: string, field: string, opts?: any, tipo?: string) {
    this.presentLoading();
    this.query = {
      path,
      field,
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    }
    var first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .where("tipo", "==", tipo)

    })
    if (first) {
      this.loadingDatos.dismiss();
      this.mapAndUpdate(first)

      // Create the observable array for consumption in components
      this.data = this._data.asObservable()
        .scan((acc, val) => {
          return this.query.prepend ? val.concat(acc) : acc.concat(val)
        })
    }
  }

  initHistorial(path: string, field: string, opts?: any, idx?:string) {
    this.presentLoading();
    this.query = {
      path,
      field,
      limit: 5,
      reverse: false,
      prepend: false,
      ...opts
    }
    var first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .where("idUsuario", "==", idx)
        .where("estatusFinal", "==", "rsv_copletada")
        .where("estatus", '==', "Finalizado")

    })
    if (first) {
      this.loadingDatos.dismiss();
      this.mapAndUpdate(first)

      // Create the observable array for consumption in components
      this.data = this._data.asObservable()
        .scan((acc, val) => {
          return this.query.prepend ? val.concat(acc) : acc.concat(val)
        })
    }
  }

  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor()

    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor)
        .where("fecha", ">=", this.fechaEventos)
    })
    this.mapAndUpdate(more)
  }

  //
  moreSucursal(tipo) {
    const cursor = this.getCursor()

    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor)
        .where("tipo", "==", tipo)
    })
    this.mapAndUpdate(more)
  }

  moreHistorial(idx) {
    const cursor = this.getCursor()

    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor)
        .where("idUsuario", "==", idx)
        .where("estatusFinal", "==", "rsv_copletada")
        .where("estatus", '==', "Finalizado")
    })
    this.mapAndUpdate(more)
  }


  // Determines the doc snapshot to paginate query 
  private getCursor() {
    const current = this._data.value
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc
    }
    return null
  }


  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {

    if (this._done.value || this._loading.value) { return };

    // loading
    this._loading.next(true)

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .do(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data()
          const doc = snap.payload.doc
          return { ...data, doc }
        })

        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values

        // update source with new values, done loading
        this._data.next(values)
        this._loading.next(false)

        // no more values, mark done
        if (!values.length) {
          this._done.next(true)
        }
      })
      .take(1)
      .subscribe()

  }

  // Reset the page
  reset() {
    this._data.next([])
    this._done.next(false)
  }

  presentLoading() {
    this.loadingDatos = this.loadingCtrl.create({
      showBackdrop: true
    });
    this.loadingDatos.present();
  }

}
