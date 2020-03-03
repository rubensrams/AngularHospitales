import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';


declare function _initPlugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean;
  email: string;
  auth2: any;

  // tslint:disable-next-line: variable-name
  constructor(public _router: Router, public _usuarioService: UsuarioService, public _ngZone: NgZone) { }

  // Siempre entra cada que muestra la pagina
  ngOnInit() {
    _initPlugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }

  }

  // Inicializando objetos de google
  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        cliente_id: '85242308983-72dmoaqa04pspg63mlfpf2qg6eb35n9d.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'   // informacion que se neceita del que se loguea de google
      });

      this.attachSignIn(document.getElementById('btnGoogle'));

    });

  }

attachSignIn(element) {

  this.auth2.attachClickHandler( element, {}, (googleUser) => {

    // profile
    // let profile = googleUser.getBasicProfile();

    // token
    const token = googleUser.getAuthResponse().id_token;

    // Se usa ngZone porque cuando se loguea por google sale mal refrescado el dashboard

    // Para enviar el token por los headers
    this._usuarioService.token = token; // Se usa para saber si esta leqgueado el usaurio
    // console.log(token);
    this._usuarioService.loginGoogle(token)
          .subscribe(() => {
            this._ngZone.run(() => this._router.navigate(['/dashboard']));
          });
          // Con esto preguntara siempre que cuenta loguearse
    this.auth2.disconnect();

  });

}

ingresar(forma: NgForm) {

  console.log(forma.value);
  console.log(forma.valid);

  if (forma.invalid) {
    return;
  }
  const usuario = new Usuario(null, forma.value.email, forma.value.password);

  this._usuarioService.login(usuario, forma.value.recuerdame).subscribe( correcto => {
          this._router.navigate(['/dashboard']);
  });
}

}
