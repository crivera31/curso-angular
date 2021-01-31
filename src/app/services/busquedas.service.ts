import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { Hospital } from '../model/hospital';
import { Medico } from '../model/medico';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get cab_x_token() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }
  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre,user.email,'',user.enabled,user.foto,user.google,user.role,user.uid)
    );
  }
  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados;
  }
  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados;
  }
  buscarUsuario(tipo: 'usuarios'|'medicos'|'hospitales', termino: string): Observable<any[]> {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get(url,this.cab_x_token).pipe(
      map( (res: any) => {
        console.log(res)
        switch(tipo) {
          case 'usuarios':
            return this.transformarUsuarios(res.resultados);
          case 'medicos':
            return this.transformarMedicos(res.resultados);
          case 'hospitales':
            return this.transformarHospitales(res.resultados);
          default:
            return[];
        }
      })
    );
  }
  busquedaGlobal(termino: string): Observable<any> {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url,this.cab_x_token);
  }
}
