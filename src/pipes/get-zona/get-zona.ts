import { Pipe, PipeTransform } from '@angular/core';
import { SucursalAltaProvider } from '../../providers/sucursal-alta/sucursal-alta';

@Pipe({
  name: 'getZona',
})
export class GetZonaPipe implements PipeTransform {

  constructor(private sucursalProvider: SucursalAltaProvider) {

  }

  async transform(idZona: string) {
    const sucursal : any = await this.sucursalProvider.getDataZona(idZona);

    const suc: string = sucursal as string;

    const data = JSON.parse(suc);

    return data;

  }
}
