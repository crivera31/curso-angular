import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: ['./grafica1.component.css']
})
export class Grafica1Component implements OnInit {
  /**componente padre grafica*/
  public cars: any = [
    {id: 1, name: 'punto'},
    {id: 2, name: 'final'}
  ];
  
  public labels1: string[] = ['Pan', 'Refresco', 'Tacos'];
  public data1 = [
    [15, 40, 10]
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
