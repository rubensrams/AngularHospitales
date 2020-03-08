import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor(public http: HttpClient) { }


// Puede subir culquier cosa
subirArchivo( archivo: File, tipo: string, id: string ) {

  return new Promise( (resolve, reject ) => {

    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append( 'imagen', archivo, archivo.name );

    xhr.onreadystatechange = function() {

      if ( xhr.readyState === 4 ) {

        if ( xhr.status === 200 ) {
          console.log( 'Imagen subida' );
          // El JSON parse es importante porque si no en la
          // subida se regresa una cadena y se necesita un
          // objeto
          resolve( JSON.parse( xhr.response ) );
        } else {
          console.log( 'Fallo la subida' );
          reject( xhr.response );
        }

      }
    };

    const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;

    xhr.open('PUT', url, true );
    xhr.send( formData );

    });

  }


/******************************************************** */

// FORMA 1 USANDO JAVASCRIPT

/*********************************************************** */

   /* fileUpload(fileItem: File, tipo: string, id: string) {

      return new Promise( (resolve, reject ) => {

      const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
      const formData: FormData = new FormData();
      formData.append('imagen', fileItem, fileItem.name);
      this.http.put(url, formData, { reportProgress: true }).pipe(map((resp: any) => {
        console.log(resp );
        if (resp.ok === true) {
            console.log( 'Exito desde nueva promesa' );
            resolve(resp);
        } else {
          console.log( 'Fallo la subida desde nueva promesa' );
          reject(resp);
        }

      }));
    });

    }*/


/******************************************************** */

// FORMA 2 USANDO ANGULAR PARA SUBIR ARCHIVOS

/*********************************************************** */


    fileUpload(fileItem: File, tipo: string, id: string) {
      const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
      const formData: FormData = new FormData();
      formData.append('imagen', fileItem, fileItem.name);
      return this.http.put(url, formData, { reportProgress: true });
    }


}
