import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menu: any[] = [
    {
      titulo: 'Dashboard', /**cambia el nombre de menu */
      icono: 'mdi mdi-gauge',
      submenu: [
        {
          titulo: 'Main', url: '/'
        },
        {
          titulo: 'ProgressBar', url: 'progress'
        },
        {
          titulo: 'Gráficas', url: 'grafica1'
        },
        {
          titulo: 'Promesas', url: 'promesas'
        },
        {
          titulo: 'RxJs', url: 'rxjs'
        }
      ]
    },
    {
      titulo: 'Mantenimientos', /**cambia el nombre de menu */
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        {
          titulo: 'Usuarios', url: 'usuarios'
        },
        {
          titulo: 'Hospitales', url: 'hospitales'
        },
        {
          titulo: 'Médicos', url: 'medicos'
        }
      ]
    },
  ]

  constructor() { }
}
