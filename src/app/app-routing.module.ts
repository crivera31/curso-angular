import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//modulos
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { NotPageFoundComponent } from './pages/not-page-found/not-page-found.component';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';

/*mis rutas principales */
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'not-authorized', component: NotAuthorizedComponent,data: { titulo: 'No autorizado'} },
  { path: '**', component: NotPageFoundComponent },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
