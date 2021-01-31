import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../model/usuario';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap,map, catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

declare const gapi: any;
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
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
  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }
  guardarLocalStorage(token: string) {
    localStorage.setItem('token',token);
  }
  get cab_json() {
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    };
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
  /**
   * @returns Observable
   * para renovar token 
   */
  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`,this.cab_x_token).pipe( /**solo envia el x-token en header */
      /**renovamos token en localstorage */
      map( (res: any) => {
        // console.log(res);
        const { enabled, role, google, nombre, email, foto = '', uid } = res.usuario;
        this.usuario = new Usuario(nombre, email, '',enabled, foto, google, role, uid);
        // console.log('res del TAP => ' +JSON.stringify(res));
        this.guardarLocalStorage(res.token);
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
    return this.http.post<any>(`${base_url}/usuarios`,usuario,this.cab_json).pipe( /**solo envia el body y content type json*/
      tap(res => {
        this.guardarLocalStorage(res.token);
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
    };
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data,this.cab_x_token_json);  /**envia x-token y body content type json */
  }
  /**
   * @param  {Usuario} usuario
   * @returns Observable
   */
  login(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${base_url}/login`,usuario,this.cab_json).pipe( /**solo envia body y content type json */
      tap(res => {
        this.guardarLocalStorage(res.token);
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
    return this.http.post<any>(`${base_url}/login/google`, body, this.cab_json).pipe( /**solo envia body y content type json */
      tap(res => {
        this.guardarLocalStorage(res.token);
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
  cargarUsuarios(desde: number = 0): Observable<any> {
    // localhost:3005/api/usuarios?desde=0
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<any>(url,this.cab_x_token).pipe(
      // delay(5000),
        map( res => {
          // console.log(res);
          /**cambiamos el arreglo de objetos por uno tipo usuario */
          const usuarios = res.usuarios.map(
            user => new Usuario(user.nombre,user.email,'',user.enabled,user.foto,user.google,user.role,user.uid)
          );
          return {
            'total_reg': res.total_reg,
              usuarios
          };
        })
    );
  }
  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url,this.cab_x_token);
  }
  actualizarRole(usuario: Usuario): Observable<any> {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario,this.cab_x_token_json);  /**envia x-token y body content type json */
  }
}