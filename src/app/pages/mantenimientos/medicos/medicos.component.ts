import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../model/medico';
import { BaseService } from '../../../services/base.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit,OnDestroy {
  public cargando: boolean;
  public encontrados: boolean;
  public totalEncontrados: number;
  public lstMedicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService, private baseService: BaseService, private busquedaService: BusquedasService) {
    this.cargando = true;
    this.encontrados = false;
    this.totalEncontrados = 0;
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarMedicos();
    /**para no recargar al cambiar foto */
    this.imgSubs = this.baseService.nuevaImg.pipe(
      delay(100)
    ).subscribe(
      img => {
        this.cargarMedicos();
      }
    )
  }
  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe(
      res => {
        // console.log(res);
        this.cargando = false;
        this.lstMedicos = res;
      }
    )
  }
  abrirModal(medico: Medico) {
    // console.log(usuario);
    this.baseService.abrirModal('medicos',medico._id,medico.foto);
  }
  onKey(data: string) {
    const termino = data.length;
    if(termino === 0) {
      this.encontrados = false;
      this.cargarMedicos();
    }
  }
  buscarMedico(termino: string) {
    if (termino != '') {
      this.busquedaService.buscarUsuario('medicos',termino).subscribe(
        res => {
          this.encontrados = true;
          // console.log(res);
          this.totalEncontrados = res.length
          this.lstMedicos = res
        }
      )
    }
  }
  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo.'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id).subscribe(
          res => {
            console.log(res);
            this.cargarMedicos();
            // this.baseService.msgSuccess(res.msg);
          },
          err => {
            console.log(err);
            // this.baseService.msgError(err.error.msg);
          }
        );
      }
    })
  }
}
