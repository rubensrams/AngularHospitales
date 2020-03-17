import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { ModalBridgeService } from '../../components/modal-upload/modal-bridge.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public usuariosService: UsuarioService, public modalBridge: ModalBridgeService) { }

  ngOnInit() {
    // AQUI SE MANDA UN NOTIFICACION DEL USUARIO ACTUALIZADO
    this.cargarUsuarios();
    this.modalBridge.notificacion.subscribe( resp => {
      this.cargarUsuarios();
    });
  }

  cargarUsuarios() {

    this.cargando = true;
    this.usuariosService.cargarUsuarios(this.desde).subscribe((resp: any) => {

      console.log(resp);
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });

  }


  cambiarDesde(val: number) {

    const desde = this.desde + val;

    if ( desde >= this.totalRegistros) {
        return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += val;
    this.cargarUsuarios();

  }

  buscarUsuario(busqueda: string) {

    if (busqueda.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this.usuariosService.buscarUsuarios(busqueda).subscribe((usuarios: Usuario[]) => {

      this.usuarios = usuarios;
      this.cargando = false;

    });

  }


  borrarusuario(usuario: Usuario) {
    // validando que no te puedas borrar a ti mismo

    if ( usuario._id === this.usuariosService.usuario._id) {
      Swal.fire('No puede borrar el usuario', 'No se puede borrrar a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        this.usuariosService.borrarUsuario(usuario).subscribe( resp => {
            console.log(resp);
            this.cargarUsuarios();
        });
        Swal.fire(
          'Borrado',
          'El usuario ha sido borrado exitosamente',
          'success'
        );
      }
    });

  }


  guardarusuario(usuario: Usuario) {
      
    this.usuariosService.actualizarUsuario(usuario).subscribe();

  }

  setIdModal(id: string) {

    this.modalBridge.setDatos('usuarios', id);

  }

}
