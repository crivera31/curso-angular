import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  public progreso1: number = 25;
  public progreso2: number = 35;
  
  constructor() { }

  ngOnInit(): void {
  }

    get getPorcentaje1() {
    return `${ this.progreso1 }%`;
  }

    get getPorcentaje2() {
    return `${ this.progreso2 }%`;
  }

  // cambioValorHijo(valor: number) {
  //   console.log('Hey!!!!', valor)
  // }


}