import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicosService } from '../../services/medicos/usuario/medicos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  cargando: boolean = true;
  totalRegistros: number = 0;
  medicos: Medico[] = [];
  desde: number = 0;
  constructor(public medicoService: MedicosService) { }

  ngOnInit() {
    this.cargarMedicos();
    /*this.modalBridge.notificacion.subscribe( resp => {
      this.cargarHospitales();
    });*/
  }

  setIdModal(id: string) {

   // this.modalBridge.setDatos('usuarios', id);

  }
  buscarMedicos(busqueda: string){
    if (busqueda.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.cargando = true;
    this.medicoService.buscarMedicoTermino(busqueda).subscribe((medicos: Medico[]) => {

      this.medicos = medicos;
      this.cargando = false;

    });
  }


  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.medicos = resp.medicos;
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
    this.cargarMedicos();

  }

  buscarMedico(busqueda: string){
    if (busqueda.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.cargando = true;
    this.medicoService.buscarMedicoTermino(busqueda).subscribe((medicos: Medico[]) => {
      this.medicos = medicos;
      this.cargando = false;

    });
  }

  guardarMedico(){

  }


borrarMedico(medico: Medico) {
// validando que no te puedas borrar a ti mismo
Swal.fire({
  title: 'Esta seguro?',
  text: 'Esta a punto de borrar al medico ' + medico.nombre,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si'
}).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico(medico._id).subscribe( resp => {
            console.log(resp);
            this.cargarMedicos();
        });
        Swal.fire(
          'Borrado',
          'El medico ha sido borrado exitosamente',
          'success'
        );
      }
    });
  }
}
