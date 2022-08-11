import { Pipe, PipeTransform } from '@angular/core';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';

@Pipe({
  name: 'getSucursal',
})
export class GetSucursalPipe implements PipeTransform {

  constructor(private sucursalProvider: SucursalAltaProvider) {

  }

  async transform(idSucursal: string) {
    
    const sucursal : any = await this.sucursalProvider.getDataSucursal(idSucursal);

    const suc: string = sucursal as string;

    const data = JSON.parse(suc);

    return data;

  }
}
