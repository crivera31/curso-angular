import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

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
  private transformarData(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre,user.email,'',user.enabled,user.foto,user.google,user.role,user.uid)
    );
  }
  buscarUsuario(tipo: 'usuarios'|'medicos'|'hospitales', termino: string): Observable<any[]> {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get(url,this.cab_x_token).pipe(
      map( (res: any) => {
        console.log(res)
        switch(tipo) {
          case 'usuarios':
            return this.transformarData(res.resultados)
          default:
            return[];
        }
      })
    )
  }
}
