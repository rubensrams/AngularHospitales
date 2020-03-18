import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from '../../models/medico.model';
import { MedicosService } from '../../services/medicos/usuario/medicos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalBridgeService } from '../../components/modal-upload/modal-bridge.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];

  medico: Medico = new Medico('', '', '', null, '');
  hospital: Hospital = new Hospital('');

  constructor(public hospitalService: HospitalService,
              public medicoService: MedicosService,
              public router: Router,
              public activateRoute: ActivatedRoute,
              public modalBridge: ModalBridgeService) {

                activateRoute.params.subscribe( params => {

                  const id = params.id;

                  if (id !== 'nuevo'){
                     this.cargarMedico(id);
                  }

                });
              }

  ngOnInit() {

      this.hospitalService.cargarHospitales().subscribe((resp: any) => {

        this.hospitales =  resp.hospitales;

      });

      this.modalBridge.notificacion.subscribe( resp => {
        this.medico.img = resp.medicoActualizado.img;
    });

  }

  guardarMedico( forma: NgForm) {

    if (forma.invalid) {
      return;
    }

    this.medicoService.crearMedico(this.medico).subscribe(resp => {
      console.log(resp);
      this.medico = resp;
      this.router.navigate(['/medico', resp._id]);
    });
  }

  cambiaHospital( id: string) {
  this.hospitalService.buscarHospitalId(id).subscribe((resp: any) => {
  this.hospital = resp.hospital;
  });
}

  cargarMedico(id: string) {
      this.medicoService.cargarMedico(id).subscribe( resp => {
        this.medico = resp;
        this.medico.hospital = resp.hospital._id;
        this.cambiaHospital(resp.hospital);
      });
  }


  cambiarFotografia(id: string) {

    this.modalBridge.setDatos('medicos', id);

  }

}
