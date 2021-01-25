import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../model/medico';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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
  get cab_x_token_json() {
    return {
      headers: {
        'x-token': this.token,
        'Content-Type': 'application/json'
      }
    };
  }
  cargarMedicos() {
    const url = `${base_url}/medicos`;
    return this.http.get(url,this.cab_x_token).pipe(
      map( (res: {ok: boolean, medicos: Medico[]}) => res.medicos)
    );
  }
  getMedico(id: string) {
    const url = `${base_url}/medicos/${id}`;
    return this.http.get(url,this.cab_x_token).pipe(
      map( (res: {ok: boolean, medico: Medico}) => res.medico)
    );
  }
  crearMedico(medico: {nombre: string, hospital: string}) {
    const url = `${base_url}/medicos`;
    return this.http.post(url,medico,this.cab_x_token_json);
  }
  actualizarMedico(medico: Medico): Observable<any> {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url,medico,this.cab_x_token_json);
  }
  borrarMedico(_id: string): Observable<any> {
    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url,this.cab_x_token);
  }
}
