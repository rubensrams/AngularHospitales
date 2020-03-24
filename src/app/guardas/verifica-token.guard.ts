import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario/usuario.service';
import { resolve } from 'url';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivateChild {

  constructor(public usuarioService: UsuarioService, public router: Router) {

  }
  canActivateChild(): Promise<boolean> | boolean {
  
    const token = this.usuarioService.token;


    // recuperar info del token
    // Decodifica el token
    const payload = JSON.parse( atob(token.split('.')[1] ));
    const expirado = this.expirado(payload.exp);

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    } else {
        return this.verificaRenueva(payload.exp);
    }

  }
// Esta funcion solo valida que si navega ya expirado el token 
// genera un nuevo token y puede seguir en la aplicacion
// ya que al tiempo actual le suma 4 horas y por automatico el token
// ya expiro!.
  verificaRenueva(fechaExp: number): Promise<boolean> {

    return new Promise( (resolve, reject) => {

      const tokenExp = new Date(fechaExp * 1000);
      const ahora = new Date();

      ahora.setTime(ahora.getTime() + (4 * 60 * 60 * 1000));

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this.usuarioService.renuevaToken().subscribe( () => {
          resolve(true);
        }, () => {
          reject(false);
          this.router.navigate(['/login']);
        });
      }


    });
  }

  expirado(fechaExp: number) {

    const ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }

  }
}
