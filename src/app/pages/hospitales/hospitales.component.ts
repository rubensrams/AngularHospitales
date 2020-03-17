import { Component, OnInit, ViewChild } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import Swal from 'sweetalert2';
import { ModalBridgeService } from '../../components/modal-upload/modal-bridge.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  
  cargando: boolean = true;
  totalRegistros: number = 0;
  hospitales: Hospital[] = [];
  desde: number = 0;

  constructor(public hospitalService: HospitalService, public modalBridge: ModalBridgeService) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalBridge.notificacion.subscribe( resp => {
      this.cargarHospitales();
    });
  }
  
  cargarHospitales() {

    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;
    });

  }

  buscarHospital(busqueda: string){
    if (busqueda.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;
    this.hospitalService.buscarHospitalTermino(busqueda).subscribe((hospitales: Hospital[]) => {
      console.log(hospitales);
      this.hospitales = hospitales;
      this.cargando = false;

    });
  }

  setIdModal(id: string){
  
    this.modalBridge.setDatos('hospitales', id);
  }
 
  guardarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital).subscribe(resp =>{
    });
  }
  borrarHospital(hospital: Hospital){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'Esta a punto de borrar el hospital ' + hospital.nombre,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.value) {
          this.hospitalService.borrarHospital(hospital._id).subscribe( resp => {
              console.log(resp);
              this.cargarHospitales();
          });
          Swal.fire(
            'Borrado',
            'El Hospital ha sido borrado exitosamente',
            'success'
          );
        }
      });
  

  }


  async alertCrearHospital(){
    const { value: hospital } = await Swal.fire({
      title: 'Ingresa el nombre:',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor ingresa el nombre del hospital';
        }
      }
    });
    if (hospital) {
      this.hospitalService.crearHospital(hospital).subscribe( resp => {
            console.log(resp);
            this.cargarHospitales();
      });
    }
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
    this.cargarHospitales();

  }
}
