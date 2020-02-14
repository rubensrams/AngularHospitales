import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {
 
subscription: Subscription;


  ngOnDestroy(): void {
   console.log('La pagina se va a cerrar');
   this.subscription.unsubscribe();
  }

  constructor() { 


   

    this.subscription = this.regresaObservable()
    .subscribe(
        numero => console.log('Subs', numero),
        error => console.error('Error en el observable', error),
        () => console.log('El observador termino')
    ) ;

}

  ngOnInit() {
  }


  regresaObservable(): Observable<any>{

    return new Observable( (observer: Subscriber<any>) => {

      let contador = 0;

      let intervalo = setInterval( () => {

        contador += 1;

         const salida = {
           valor: contador
         };

        observer.next(salida);

        /*if(contador === 3) {

          clearInterval(intervalo);
          observer.complete();
        }*/

       /* if(contador===2){
          //clearInterval(intervalo);
          observer.error('auxilio');
        }*/

      }, 1000);
    }).pipe(

      map(resp => {
          return resp.valor;
      }), filter(( valor, index) => {

        if ((valor % 2 ) === 1) {
          return true;
        } else {
          return false;
        }
          

      })
    )

  }

}
