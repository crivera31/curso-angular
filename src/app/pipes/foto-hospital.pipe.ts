import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'fotoHospital'
})
export class FotoHospitalPipe implements PipeTransform {

  transform(foto: string, tipo: 'usuarios|medicos|hospitales'): string {
    if(!foto) {
      return `${base_url}/uploads/usuarios/no-image`;
    } else if(foto.includes('https')) {
      return foto;
    } else if(foto) {
      return `${base_url}/uploads/${tipo}/${foto}`;
    } else {
      return `${base_url}/uploads/usuarios/no-image`;
    }
  }

}
