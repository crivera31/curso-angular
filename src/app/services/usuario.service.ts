import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../model/usuario';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap,map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

declare const gapi: any;
const base_url = environment.base_url;
const cabecera_json = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public auth2: any;
  
  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
  }
  /**
   * @returns Observable
   * para renovar token 
   */
  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    const httpHeaders = new HttpHeaders({
      'x-token': token
    });
    return this.http.get(`${base_url}/login/renew`,
    {
      headers: httpHeaders
    }).pipe(
      /**renovamos token en localstorage */
      tap( (res: any) => {
        // console.log('res del TAP => ' +JSON.stringify(res));
        localStorage.setItem('token',res.token);
      }),
      map( res => true),
      catchError( error => of(false)) /**devuelve false porque no logro hacer autenticacion */
    );
  }
  /**
   * @param  {Usuario} usuario
   * @returns Observable
   */
  crearUsuario(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${base_url}/usuarios`,usuario,cabecera_json).pipe(
      tap(res => {
        localStorage.setItem('token',res.token);
      })
    );
  }
  /**
   * @param  {Usuario} usuario
   * @returns Observable
   */
  login(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${base_url}/login`,usuario,cabecera_json).pipe(
      tap(res => {
        localStorage.setItem('token',res.token);
      })
    );
  }
  /**
   * @param  {any} token
   * @returns Observable
   */
  loginGoogle(token: any): Observable<any> {
    let body = {
      'token': token
    }
    return this.http.post<any>(`${base_url}/login/google`, body, cabecera_json).pipe(
      tap(res => {
        localStorage.setItem('token',res.token);
      })
    );
  }

  googleInit() {
    return new Promise<void>( resolve => {
      // console.log('Google Init');
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '497661797108-1bodlmfnetbjuvtludc8qu3rp9jg8dcj.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
        resolve();
      });
    })
  }
  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then( () => {
      this.ngZone.run(() => {
        console.log('Login google: User signed out.');
        this.router.navigateByUrl('/login');
      });
    });
  }
}