import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/archivos/subir-archivo.service';
import { ModalBridgeService } from './modal-bridge.service';
@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;
  oculto: string = '';
  @ViewChild('closebutton', null) closebutton;
  @ViewChild( 'inputFile', null ) inputFile: any;

  constructor(public subirArchivo: SubirArchivoService, public modalBridge: ModalBridgeService) { 

    console.log('Modal listo');
  }

  seleccioneImagen( archivo ) {
    if (!archivo) {
        return;
    }
    console.log(archivo);
  
    if (archivo.type.indexOf('imagen') > 0 ) {
      Swal.fire('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    this.imagenSubir = archivo;
  
    // vista previa puro JS
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
          this.imagenTemp = reader.result;
      };
  
    }
    ngOnInit() {
  }

  subirImagen(){
    
    this.subirArchivo.fileUpload(this.imagenSubir, this.modalBridge.tipo, this.modalBridge.id).subscribe(resp=> {
      this.modalBridge.notificacion.emit(resp);
      this.closebutton.nativeElement.click();
      this.inputFile.nativeElement.value = '';
    });

  }

  limpiarValores() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    console.log('limpio');
  }


}
