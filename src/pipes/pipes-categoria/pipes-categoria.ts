import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'pipesCategoria',
})
export class PipesCategoriaPipe implements PipeTransform {

transform(value: any[], arg: any): any {
  if (!arg) return value;
    const resultPosts = [];
    for (const sucursal of value) {
      if (sucursal.tipo.indexOf(arg) > -1 ) {
        resultPosts.push(sucursal);
    }
    }
    return resultPosts;
  }
}
