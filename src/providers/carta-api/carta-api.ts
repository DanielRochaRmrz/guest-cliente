import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable()
export class CartaApiProvider {

  public baseURL: string = 'https://api.sistemarms.com/api/MenuDigital';

  public baseURLGuest: string = 'https://guestresy.com/api/api';
  private token: string = '1|xM0QAzYL5LqGv5Jp4IUgkbwZgbBlQJSj3oMbTIHD';
  
  
  constructor(public http: HttpClient) {
    console.log('Hello CartaApiProvider Provider');
  }

  // Obtener menu de Erick Restauran Maestro
  
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
  
  // Obtener menu de GuestResy

  getMenuGuest(idSucursal: string) {
    const url = `${this.baseURLGuest}/show-menu-by-branch/${idSucursal}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    )
    return this.http.get(url, { headers })
            .pipe(
              map((resp: any) => {
                return resp.menu
              })
            );
  }

  getSubmenuGuest() {
    const url = `${this.baseURLGuest}/show-submenu-by-menu/1`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    )
    return this.http.get(url, { headers })
            .pipe(
              map((resp: any) => {
                return resp.submenu
              })
            );
  }

  getProductGuest(idSubmenu: string) {
    const url = `${this.baseURLGuest}/show-product-by-submenu/${idSubmenu}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    )
    return this.http.get(url, { headers })
            .pipe(
              map((resp: any) => {
                return resp.product
              })
            );
  }

  getOneProductGuest(claveProducto: string) {
    const url = `${this.baseURLGuest}/show-product/${claveProducto}`;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    )
    return this.http.get(url, { headers })
            .pipe(
              map((resp: any) => {
                return resp.product
              })
            );
  }
  
}
