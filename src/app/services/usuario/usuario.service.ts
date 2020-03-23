import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError  } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../archivos/subir-archivo.service';
import { throwError, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];
  constructor(
    public http: HttpClient, public router: Router, public subirArchivo: SubirArchivoService
  ) {
    this.cargarStorage();

  }

  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario =  JSON.parse(localStorage.getItem('usuario'));
      this.menu =  JSON.parse(localStorage.getItem('menu'));

    } else {
      this.token = '';
      this.usuario =  null;
      this.menu =  [];
    }

  }

  estaLogueado() {

    return (this.token.length > 5 ? true : false);

  }


  logout() {
    this.token = '';
    this.usuario =  null;
    this.menu =  [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(['/login']);


  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

  }


  loginGoogle( token: string ) {
    const url = URL_SERVICIOS + '/login/google';

    let headers = new HttpHeaders(); // Instancia de HttpHeaders
    headers = headers.set('Content-Type', 'application/json')
    .append('Authorization', token);
    // Definimos el tipo de contenido que enviaremos

    // tslint:disable-next-line: max-line-length
    // Anexamos el token ( Authorization es el nombre de la variable que estoy                                              enviando por el header, pueden verificarlo en el postman o cambiarle el
    // nombre pero se recomienda que sea Authorization)
    // tslint:disable-next-line: object-literal-shorthand

    // El nulo que se pasa tengo duda a que se refiere,
    // supongo que es el post que recibe el methodo POST
    return this.http.post(url, null, { headers }).pipe(map((resp: any) => {
      this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }));
  }

  login(usuario: Usuario, recuerdame: boolean) {

    if ( recuerdame ) {
        localStorage.setItem('email' , usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    // tslint:disable-next-line: prefer-const
      // tslint:disable-next-line: align
      const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).pipe(map((resp: any) => {
      this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
      return true;
    }), catchError(err => {
       console.log(err.error.mensaje);
       Swal.fire('Error en el login', err.error.mensaje, 'error');
       return of(false);
    }));
  }

  creaUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(map((resp: any) => {
      Swal.fire('Usuario creado', usuario.email, 'success');
      return resp.usuario;
  }), catchError(err => {
    console.log(err.error.mensaje);
    Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
    return of(false);
 }));

  }


  actualizarUsuario( usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(map((resp: any) => {
      // Se valida que se guarde en local storage si el usuario que actualiza es el mismo
      if (usuario._id === this.usuario._id) {
        const usuarioDB: Usuario = resp.usuario;
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
      }
      Swal.fire('Usuario actualizado', usuario.email, 'success');
      return true;
  }), catchError(err => {
    console.log(err.error.mensaje);
    Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
    return of(false);
 }));
  }



  /************************USANDO LA FORMA 1 (JAVASCRIP) PARA CONECTAR LA SUBIDA DE FRONT A BACK */


/*  cambiarImagen(file: File, id: string) {
    console.log('cambiarImagen ');
    this.subirArchivo.fileUpload( file, 'usuarios', id)
    .then( (resp: any) => {
      console.log('termino ok ', resp);
      this.usuario.img = resp.usuarioActualizado.img;
      this.guardarStorage(id, this.token, this.usuario);
      Swal.fire('Usuario actualizado', this.usuario.nombre, 'success');
    }).catch( resp => {
      console.log('termino error' + resp);
      Swal.fire('Error al actualizar la imagen',  'error');
    });

  }*/


  /************************USANDO LA FORMA 2  (ANGULAR) PARA CONECTAR LA SUBIDA DE FRONT A BACK */

  cambiarImagen(file: File, id: string) {
      this.subirArchivo.fileUpload( file, 'usuarios', id).subscribe( (resp: any) => {
      this.usuario.img = resp.usuarioActualizado.img;
      this.guardarStorage(id, this.token, this.usuario, this.menu);
      Swal.fire('Usuario actualizado', this.usuario.nombre, 'success');
    });

  }

  cargarUsuarios(desde: number= 0) {

    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url).pipe(map((resp: any) => {
            return resp.usuarios;
  }));
  }

  borrarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.delete(url);
  }

}
