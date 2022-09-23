import { Pipe, PipeTransform } from '@angular/core';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@Pipe({
  name: 'getCompartidaTelUs',
})
export class GetCompartidaTelUsPipe implements PipeTransform {

  constructor(private usuarioProvider: UsuarioProvider ) {

  }
  
  async transform(telefono: string) {

    const usuario : any = await this.usuarioProvider.buscarUserTelefono(telefono);

    const us: string = usuario as string;

    const data = JSON.parse(us);
    console.log('Usuarios COM -->', data);
    
    return data[0];
  }

}
