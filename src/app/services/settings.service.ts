import { Injectable } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

ajustes: Ajustes ={

  urlTema: 'assets/css/colors/default.css',
  tema: 'default'

}

  constructor(@Inject(DOCUMENT) private _document,) { 

   this.cargarAjustes();
   
  }


 guardarAjustes() {

  console.log('Guardando en el local storage');
  localStorage.setItem('ajustes', JSON.stringify(this.ajustes));

}

cargarAjustes() {

  if(localStorage.getItem('ajustes')){

    this.ajustes = JSON.parse(localStorage.getItem('ajustes'));

  }
    this.aplicarTema(this.ajustes.tema);
}


aplicarTema(tema: string){

  let url = `assets/css/colors/${tema}.css`;
  this._document.getElementById('tema').setAttribute('href', url);

  this.ajustes.urlTema = url;
  this.ajustes.tema = tema;

  this.guardarAjustes();
}

}
//Creando la interfaz para los setings
interface Ajustes{

  urlTema: string;
  tema: string;
}