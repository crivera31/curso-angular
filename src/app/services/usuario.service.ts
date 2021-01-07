import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../model/usuario';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap,map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

declare const gapi: any;
const base_url = environment.base_url;
// const cabecera_json = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  public usuario: Usuario;
  public auth2: any;
  
  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get uid(): string {
    return this.usuario.uid || '';
  }
  /**
   * @returns Observable
   * para renovar token 
   */
  validarToken(): Observable<boolean> {
    const httpHeaders = new HttpHeaders({
      'x-token': this.token
    });
    return this.http.get(`${base_url}/login/renew`,
    {
      headers: httpHeaders
    }).pipe(
      /**renovamos token en localstorage */
      map( (res: any) => {
        // console.log(res);
        const { enabled, role, google, nombre, email, foto = '', uid } = res.usuario;
        this.usuario = new Usuario(nombre, email, '', foto, google, role, uid);
        // console.log('res del TAP => ' +JSON.stringify(res));
        localStorage.setItem('token',res.token);
        return true;
      }),
      // map( res => true),
      catchError( error => of(false)) /**devuelve false porque no logro hacer autenticacion */
    );
  }
  /**
   * @param  {Usuario} usuario
   * @returns Observable
   */
  crearUsuario(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${base_url}/usuarios`,usuario,{ headers: this.HttpHeaders }).pipe(
      tap(res => {
        localStorage.setItem('token',res.token);
      })
    );
  }
  /**
   * @param  {{email:string} data
   * @param  {string} nombre
   * @param  {string}} role
   * @returns Observable
   */
  actualizarUsuario(data: { email: string, nombre: string, role: string }): Observable<any> {
    data = {
      ...data,
      role: this.usuario.role
    }
    const httpHeaders = new HttpHeaders({
      'x-token': this.token,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: httpHeaders
    })
  }
  /**
   * @param  {Usuario} usuario
   * @returns Observable
   */
  login(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${base_url}/login`,usuario,{ headers: this.HttpHeaders }).pipe(
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
    return this.http.post<any>(`${base_url}/login/google`, body, { headers: this.HttpHeaders }).pipe(
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
        console.log('Login: User signed out.');
        this.router.navigateByUrl('/login');
      });
    });
  }
}