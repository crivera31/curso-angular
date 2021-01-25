import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hospital } from '../model/hospital';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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
  cargarHospitales() {
    const url = `${base_url}/hospitales`;
    return this.http.get(url,this.cab_x_token).pipe(
      map( (res: {ok: boolean, hospitales: Hospital[]}) => res.hospitales)
    );
  }
  crearHospitales(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post(url,{ nombre },this.cab_x_token_json);
  }
  actualizarHospital(hospital: Hospital): Observable<any> {
    const url = `${base_url}/hospitales/${hospital._id}`;
    let body = {
      'nombre': hospital.nombre
    }
    return this.http.put(url,body,this.cab_x_token_json);
  }
  borrarHospital(hospital: Hospital): Observable<any> {
    const url = `${base_url}/hospitales/${hospital._id}`;
    return this.http.delete(url,this.cab_x_token);
  }
}