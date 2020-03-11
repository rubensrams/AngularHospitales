import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalBridgeService {

  public tipo: string;
  public id: string;

  public notificacion = new EventEmitter<any>();

  constructor() { }


  public setDatos(tipo: string, id: string) {

    this.tipo = tipo;
    this.id = id;

  }

}
