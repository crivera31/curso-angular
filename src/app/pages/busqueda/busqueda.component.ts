import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hospital } from 'src/app/model/hospital';
import { Medico } from 'src/app/model/medico';
import { Usuario } from 'src/app/model/usuario';
import { BusquedasService } from '../../services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  public lstUsuarios: Usuario[] = [];
  public lstMedicos: Medico[] = [];
  public lstHospitales: Hospital[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      ({ termino }) => this.busquedaGlobal(termino) );
  }
  busquedaGlobal(termino: string) {
    this.busquedaService.busquedaGlobal(termino).subscribe(
      res => {
        console.log(res);
        this.lstUsuarios = res.usuarios;
        this.lstMedicos = res.medicos;
        this.lstHospitales = res.hospitales;
      }
    )
  }

}
