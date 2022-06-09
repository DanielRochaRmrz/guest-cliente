import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipesFilterCiudad2',
})
export class PipesFilterCiudad2Pipe implements PipeTransform {
  
  transform(value: any[], arg: any): any {
    if (!arg) return value;
      const resultPosts = [];
      for (const sucursal of value) {
        if (sucursal.ciudad.indexOf(arg) > -1 ) {
          resultPosts.push(sucursal);
      }
      }
      return resultPosts;
    }
}
