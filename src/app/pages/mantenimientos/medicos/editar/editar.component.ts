import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseService } from '../../../../services/base.service';
import { HospitalService } from '../../../../services/hospital.service';
import { MedicoService } from '../../../../services/medico.service';

import { Hospital } from 'src/app/model/hospital';
import { Medico } from '../../../../model/medico';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  public medicoForm: FormGroup;
  public medico: Medico;
  public lstHospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private router: Router,
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private baseService: BaseService,
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(
      ({ id }) => {
        this.cargarMedico(id);
      }
    )
    this.cargarHospitales();
    this.medicoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
    });

    this.medicoForm.get('hospital').valueChanges.subscribe(
      res => {
        this.hospitalSeleccionado = this.lstHospitales.find(h => h._id === res);
      }
    )
  }
  cargarMedico(id: string) {
    if(id === 'nuevo') {
      return;
    }
    this.medicoService.getMedico(id).pipe(
      delay(100)
      )
      .subscribe(
      medico => {
        console.log(medico);
        if(!medico) {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }
        const { nombre, hospital:{_id} } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre, hospital:_id});
      }
    );
  }
  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe(
      (res: Hospital[]) => {
        this.lstHospitales = res
      },
      err => {
        console.log(err);
      }
    )
  }
  guardarMedico() {
    console.log(this.medicoSeleccionado);
    if(this.medicoSeleccionado) {
      /**actualizar */
      const data= {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data).subscribe(
        res => {
          console.log(res);
        }
      )
    } else {
      /**guardar */
      this.medicoService.crearMedico(this.medicoForm.value).subscribe(
        (res: any) => {
          console.log(res);
          this.baseService.msgSuccess(res.msg);
          this.router.navigateByUrl(`/dashboard/medico/${res.medico._id}`)
        },
        err => {
          console.log(err);
        }
      );
    }

  }

}
