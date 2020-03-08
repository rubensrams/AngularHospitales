import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    let url = URL_SERVICIOS + '/img/';

    if (!img) {
      return url + 'usuarios/xxx';
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }

    switch (tipo) {

        case 'usuario':
           // tslint:disable-next-line: no-unused-expression
           url += 'usuarios/' + img;
           break;

        case 'medico':
           // tslint:disable-next-line: no-unused-expression
           url += 'medicos/' + img;
           break;

        case 'hospital':
           // tslint:disable-next-line: no-unused-expression
           url += 'hospitales/' + img;
           break;

        default:
          console.log('Tipo de imagen no existe');
          // tslint:disable-next-line: no-unused-expression
          url += 'usuarios/xxx';

     }

    return url;
  }

}
