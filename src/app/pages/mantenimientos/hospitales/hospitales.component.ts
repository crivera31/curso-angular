import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hospital } from 'src/app/model/hospital';
import { BaseService } from 'src/app/services/base.service';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit,OnDestroy {
  public cargando: boolean;
  public encontrados: boolean;
  public totalEncontrados: number;
  public lstHospitales: Hospital[] = [];
  public hospital: Hospital;
  private imgSubs: Subscription;

  constructor(private hospitalService: HospitalService, private baseService: BaseService, private busquedaService: BusquedasService) {
    // this.hospital = new Hospital('','','','');
    this.cargando = true;
    this.totalEncontrados = 0;
    this.encontrados = false;
  }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarHospitales();
    /**para no recargar al cambiar foto */
    this.imgSubs = this.baseService.nuevaImg.pipe(
      delay(100)
    ).subscribe(
      img => {
        this.cargarHospitales();
      }
    )
  }
  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(
      res => {
        // console.log(res)
        this.cargando = false;
        this.lstHospitales = res;
      }
    )
  }
  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital).subscribe(
      res => {
        console.log(res);
        this.baseService.msgSuccess(res.msg);
      },
      err => {
        console.log(err);
        this.baseService.msgError(err.error.msg);
      }
    )
  }
  eliminarHospital(hospital: Hospital) {

    Swal.fire({
      title: '¿Borrar hospital?',
      text: `Esta a punto de borrar al ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo.'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital).subscribe(
          res => {
            console.log(res);
            this.cargarHospitales();
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
  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo Hospital',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del Hospital'
    })
    if(value.trim().length > 0) {
      this.hospitalService.crearHospitales(value).subscribe(
        (res: any) => {
          this.baseService.msgSuccess(res.msg);
          this.lstHospitales.push(res.hospital);
        }
      )
    }
  }
  abrirModal(hospital: Hospital) {
    // console.log(usuario);
    this.baseService.abrirModal('hospitales',hospital._id,hospital.foto);
  }
  onKey(data: string) {
    const termino = data.length;
    if(termino === 0) {
      this.encontrados = false;
      this.cargarHospitales();
    }
  }
  buscarHospital(termino: string) {
    if (termino != '') {
      this.busquedaService.buscarUsuario('hospitales',termino).subscribe(
        res => {
          this.encontrados = true;
          console.log(res)
          this.totalEncontrados = res.length
          this.lstHospitales = res
        }
      )
    }
  }

}
