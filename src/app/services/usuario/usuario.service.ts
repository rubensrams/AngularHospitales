import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  constructor(
    public http: HttpClient, public router: Router
  ) {
    this.cargarStorage();
    console.log('Servico de usuario listo');
  }

  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario =  JSON.parse(localStorage.getItem('usuario'));

    } else{
      this.token = '';
      this.usuario =  null;
    }

  }

  estaLogueado() {

    return (this.token.length > 5 ? true : false);

  }


  logout(){
    this.token = '';
    this.usuario =  null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  guardarStorage( id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
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
      this.guardarStorage( resp.id, resp.token, resp.usuario);
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
      this.guardarStorage( resp.id, resp.token, resp.usuario);
      return true;
    }));
  }

  creaUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(map((resp: any) => {
      Swal.fire('Usuario creado', usuario.email, 'success');
      return resp.usuario;
  }));


  }
}
