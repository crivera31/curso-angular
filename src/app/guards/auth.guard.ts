import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,CanLoad {

  constructor(private usuarioService: UsuarioService, private router: Router) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.verificar();
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      // console.group("AuthGuard");
      // console.log("Paso por el guard");
      // console.groupEnd();
    return this.verificar();
  }
  verificar() {
    return this.usuarioService.validarToken().pipe(
      tap( isAutenticado => {
        // console.log("Autenticado: " +isAutenticado);
        if(!isAutenticado) {
          this.router.navigateByUrl('/login');
        }
      })
    ); /**si es false, impedira q entren a las rutas */
  }
}
