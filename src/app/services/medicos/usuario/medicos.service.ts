import { Injectable, ɵConsole } from '@angular/core';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService } from '../../usuario/usuario.service';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../../../models/medico.model';


@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  constructor(public http: HttpClient, public usuario: UsuarioService) { }

  cargarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url).pipe(map((resp: any) => {
      return resp.medico;
  }));
  }

  cargarMedicos(desde: number= 0) {
    let url = URL_SERVICIOS + '/medico?desde=' + desde;
    return this.http.get(url);
  }


  borrarMedico(	id:	string	){
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this.usuario.token;
    return this.http.delete(url);
  }

  crearMedico(medico: Medico) {

    let url = URL_SERVICIOS + '/medico';
    url += '?token=' + this.usuario.token;

    return this.http.post(url, medico).pipe(map((resp: any) => {
      Swal.fire('Medico creado', medico.nombre, 'success');
      return resp.medico;
  }));

  }

  actualizarMedico( hospital: Medico) {
    let url = URL_SERVICIOS + '/medico/' + hospital._id;
    url += '?token=' + this.usuario.token;
    return this.http.put(url, hospital).pipe(map((resp: any) => {
      Swal.fire('Hospital actualizado', hospital.nombre, 'success');
      return true;
  }));
  }

  buscarMedicoTermino(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url).pipe(map((resp: any) => {
      return resp.medicos;
    }));
  }
}
