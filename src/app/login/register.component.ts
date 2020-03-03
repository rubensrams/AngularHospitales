import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

declare function _initPlugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  // tslint:disable-next-line: variable-name
  constructor(public _service: UsuarioService, public router: Router) { }

  ngOnInit() {
    _initPlugins();
    // iniciar un formulario
    this.forma = new FormGroup({
      // valor por defecto, validaciones
      nombre: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, {validators: this.sonIguales('password', 'password2')} );

    this.forma.setValue({
        nombre: 'Test',
        email: 'test@test.com',
        password: '123456',
        password2: '123456',
        condiciones: true
      });
  }
  // tslint:disable-next-line: comment-format
  //en el segundo parametro de la forma recibe una funcion
  // tslint:disable-next-line: comment-format
  //y el nombre de los campos password a validar

  sonIguales( campo1: string,  campo2: string) {

    // se nececita regresar un form group 
    return (group: FormGroup) => {

      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
          return null;
      } 

      return {
        sonIguales: true
      };

    };

  }

  registrarUsuario() {
    // Para obtener los valores de la forma
    if (!this.forma.valid) {
        return;
    }
    if (!this.forma.value.condiciones) {
      //console.log('Debe aceptar las condiciones');
      Swal.fire('Importante', 'Debe aceptar las condiciones', 'warning');
      return;
    }

    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.password
    );

    this._service.creaUsuario(usuario).subscribe( resp => {
    
      console.log(resp);
      this.router.navigate(['login']);

    });

  }
}
