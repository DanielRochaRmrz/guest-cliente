import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'pipesFilterCiudad',
})
export class PipesFilterCiudadPipe implements PipeTransform {
 
  transform(value: any[], arg: any): any {
    if (!arg) return value;
      const resultPosts = [];
      for (const evento of value) {
        if (evento.ciudad.indexOf(arg) > -1 ) {
          resultPosts.push(evento);
      }
      }
      return resultPosts;
    }
}
