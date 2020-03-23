import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario [] = [];
  medicos: Medico [] = [];
  hospitales: Hospital [] = [];

  constructor(public activateRoute: ActivatedRoute, public httpClient: HttpClient, public router: Router) {

    this.activateRoute.params.subscribe(params => {

        const termino = params.termino;
        console.log(termino);
        this.buscar(termino);
    });
  }

  ngOnInit() {

  }

  buscar(termino: string){
    let url = URL_SERVICIOS + '/busqueda/todo/' + termino;

    this.httpClient.get(url).subscribe( (resp: any) => {
          console.log(resp);
          this.medicos = resp.medicos;
          this.hospitales = resp.hospitales;
          this.usuarios = resp.usuarios;

    });

    }



}
