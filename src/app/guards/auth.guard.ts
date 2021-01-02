import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      // console.group("AuthGuard");
      // console.log("Paso por el guard");
      // console.groupEnd();
    return this.usuarioService.validarToken().pipe(
      tap( isAutenticado => {
        if(!isAutenticado) {
          this.router.navigateByUrl('/login');
        }
      })
    ); /**si es false, impedira q entren a las rutas */
  }
  
}
