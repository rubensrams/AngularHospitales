import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress', {static: true}) txtProgress: ElementRef;
  // tslint:disable-next-line: no-input-rename
  @Input() progreso: number = 50;
  // tslint:disable-next-line: no-input-rename
  @Input('nombre') leyenda: string = 'Leyenda';

  @Output() cambiaVal: EventEmitter <number> = new EventEmitter();

  constructor() { 
  //  console.log('leyenda' , this.leyenda);
    //console.log('progreso' , this.progreso);
  }

  ngOnInit() {
  }

  cambiaValor(valor: number){

    if (this.progreso >= 100 && valor > 0 ) {
      this.progreso = 100;
      return;
    }
    if (this.progreso <= 0 && valor < 0 ) {
      this.progreso = 0;
      return;
    }
    this.progreso = this.progreso + valor;
    this.cambiaVal.emit(this.progreso);
    
  }

  onChanges(newValue: number){
  
 /* let elementHtml: any = document.getElementsByName('progreso1')[0];
  console.log(elementHtml);*/



  if (newValue >= 100) {
      this.progreso = 100;
    } else if (newValue <= 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }
    
  this.txtProgress.nativeElement.value = this.progreso;

  this.cambiaVal.emit(this.progreso);

  }
}
