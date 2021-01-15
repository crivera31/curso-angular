import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private _ocultarModal: boolean;
  public tipo: 'usuarios'|'medicos'|'hospitales';
  public id: string;
  public foto: string;
  public nuevaImg: EventEmitter<string> = new EventEmitter<string>(); /**detectar cambio de img 210 */

  constructor() {
    this._ocultarModal = true;
    // this.mostrarModal = false;
  }

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(tipo: 'usuarios'|'medicos'|'hospitales', id: string, foto: string = 'no-image' ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    if(foto.includes('https')) {
      this.foto = foto;
      // console.log(this.foto)
    } else {
      this.foto = `${base_url}/uploads/${tipo}/${foto}`;
      // console.log(this.foto)
    }
  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  msgError(msg: string) {
    Swal.fire('Error',msg,'error');
  }

  msgSuccess(msg: string) {
    Swal.fire('Éxito',msg,'success');
  }
}
