import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() { }

  msgError(msg: string) {
    Swal.fire('Error',msg,'error');
  }

  msgSuccess(msg: string) {
    Swal.fire('Éxito',msg,'success');
  }
}
