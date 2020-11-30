import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-grafica-circulo',
  templateUrl: './grafica-circulo.component.html',
  styleUrls: ['./grafica-circulo.component.css']
})
export class GraficaCirculoComponent implements OnInit {
  /**componente hijo grafica */
  @Input() title: string = 'Sin titulo'
  @Input('car') car: any;

  // Doughnut
  @Input('labels') public doughnutChartLabels: Label[] = ['Data1', 'Data2', 'Data3'];
  @Input('data') public doughnutChartData: MultiDataSet = [
    [350, 450, 100]
  ];
  public colors: Color[] = [
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059']}
  ];
  constructor() { }

  ngOnInit(): void {
    // console.log(this.car)
  }

    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }
  
    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }

}
