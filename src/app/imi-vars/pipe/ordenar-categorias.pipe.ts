import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarCategorias'
})
export class OrdenarCategoriasPipe implements PipeTransform {
  orden = [
    'Product Management',
    'Resources Management',
    'Information Management',
    'Organization Management',
    'Innovation Management'
  ];

  transform(obj: Record<string, any>): { key: string, value: any }[] {
    return this.orden
      .filter(key => key in obj)
      .map(key => ({ key, value: obj[key] }));
  }
}
