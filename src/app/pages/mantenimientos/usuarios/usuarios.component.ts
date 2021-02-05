import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../model/usuario';
import { BusquedasService } from '../../../services/busquedas.service';
import { BaseService } from '../../../services/base.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit,OnDestroy {
  public totalUsuarios: number;
  public totalEncontrados: number;
  public lstUsuarios: Usuario[] = [];
  public desde: number;
  public cargando: boolean;
  public encontrados: boolean;
  private imgSubs: Subscription;

  constructor(private usuarioService: UsuarioService, private busquedaService: BusquedasService, private baseService: BaseService) {
    this.totalUsuarios = 0;
    this.totalEncontrados = 0;
    this.desde = 0;
    this.cargando = true;
    this.encontrados = false;
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.baseService.nuevaImg.pipe(
      delay(100)
    ).subscribe(
      img => {
        this.cargarUsuarios();
      }
    )
  }
  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe(
      res => {
        // console.log(res)
        this.cargando = false;
        this.totalUsuarios = res.total_reg;
        // console.log(this.totalUsuarios);
        this.lstUsuarios = res.usuarios;
        // console.log(this.lstUsuarios);
        
      }
    )
  }
  cambiarPagina(valor: number) {
    this.desde += valor;
    if(this.desde < 0) {
      this.desde = 0;
    } else if(this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }
  buscarUsuario(termino: string) {
    if (termino != '') {
      this.busquedaService.buscarUsuario('usuarios',termino).subscribe(
        res => {
          this.encontrados = true;
          // console.log(res)
          this.totalEncontrados = res.length
          this.lstUsuarios = res
        }
      )
    }
  }
  onKey(data: string) {
    const termino = data.length;
    if(termino === 0) {
      this.encontrados = false;
      this.cargarUsuarios();
    }
  }
  eliminarUsuario(usuario: Usuario) {
    if(usuario.uid === this.usuarioService.uid) {
      return this.baseService.msgError('No puede borrarse a si mismo.');
    }
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo.'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(
          res => {
            console.log(res);
            this.cargarUsuarios();
          }
        );
      }
    })
  }
  cambiarRole(usuario: Usuario) {
    this.usuarioService.actualizarRole(usuario).subscribe(
      res => {
        console.log(res)
      }
    )
  }
  abrirModal(usuario: Usuario) {
    // console.log(usuario);
    this.baseService.abrirModal('usuarios',usuario.uid,usuario.foto);
  }

}
