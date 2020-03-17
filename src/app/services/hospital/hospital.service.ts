import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Hospital } from '../../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(public http: HttpClient, public usuario: UsuarioService) { }

  cargarHospitales(desde: number= 0) {
    let url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get(url);
  }

  buscarHospitalId(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url);
  }

  borrarHospital(	id:	string	){
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this.usuario.token;
    return this.http.delete(url);
  }

  crearHospital(nombre: string) {
    console.log(nombre);
    let hospital = new Hospital(
      nombre
    );
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this.usuario.token;

    return this.http.post(url, hospital).pipe(map((resp: any) => {
      Swal.fire('Hospital creado', nombre, 'success');
      return resp.hospital;
  }));

  }

  actualizarHospital( hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this.usuario.token;
    return this.http.put(url, hospital).pipe(map((resp: any) => {
      Swal.fire('Hospital actualizado', hospital.nombre, 'success');
      return true;
  }));
  }

  buscarHospitalTermino(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url).pipe(map((resp: any) => {
      return resp.hospitales;
    }));
  }
}
