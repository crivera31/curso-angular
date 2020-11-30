import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { GraficaCirculoComponent } from './grafica-circulo/grafica-circulo.component';



@NgModule({
  declarations: [
    IncrementadorComponent,
    GraficaCirculoComponent
  ],
  exports: [
    IncrementadorComponent,
    GraficaCirculoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
