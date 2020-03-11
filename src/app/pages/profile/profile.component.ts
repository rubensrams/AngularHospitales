import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { SubirArchivoService } from '../../services/archivos/subir-archivo.service';
import Swal from 'sweetalert2';
import { read } from 'fs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(public usuarioService: UsuarioService, public subirArchivo: SubirArchivoService) {

    this.usuario = usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar(usuario: Usuario) {

    console.log(usuario);
    this.usuario.nombre = usuario.nombre;
    this.usuario.email = usuario.email;
    this.usuarioService.actualizarUsuario(this.usuario).subscribe(resp => {

      console.log(resp);
    });
  }


  seleccioneImagen( archivo ) {


  if (!archivo) {
      return;
  }
  console.log(archivo);

  if (archivo.type.indexOf('imagen') > 0 ) {
    Swal.fire('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
    this.imagenSubir = null;
    return;
  }
  this.imagenSubir = archivo;

  // vista previa puro JS
  const reader = new FileReader();
  const urlImagenTemp = reader.readAsDataURL(archivo);
  reader.onloadend = () => {
        this.imagenTemp = reader.result;
    };

  }

 cambiarImagen() {
  this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);

 }

}
