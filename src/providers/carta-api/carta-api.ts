import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable()
export class CartaApiProvider {

  public baseURL: string = 'https://api.sistemarms.com/api/MenuDigital';
  
  constructor(public http: HttpClient) {
    console.log('Hello CartaApiProvider Provider');
  }
  
  getMenu(ClaveInstancia: string) {
    return this.http.get(`${this.baseURL}/GetMenus/${ClaveInstancia}`)
            .pipe(
              map(resp => {
                return resp
              })
            );
  }

  GetArbolMenu(ClaveMenuDigitalDetalle: string) {
    return this.http.get(`${this.baseURL}/GetArbolMenu/${ClaveMenuDigitalDetalle}`)
            .pipe(
              map(resp => {
                return resp
              })
            );
  }

  GetProductosClasificacion(ClaveMenuDigitalDetalle: string) {
    return this.http.get(`${this.baseURL}/GetProductosClasificacion/${ClaveMenuDigitalDetalle}`)
            .pipe(
              map(resp => {
                return resp
              })
            );
  }

  GetProducto(ClaveInstancia: string, claveProducto: string) {
    return this.http.get(`${this.baseURL}/GetProducto/${ClaveInstancia}/${claveProducto}`)
            .pipe(
              map(resp => {
                return resp
              })
            );
  }
  
}
