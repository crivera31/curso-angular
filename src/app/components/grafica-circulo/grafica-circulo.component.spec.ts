import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaCirculoComponent } from './grafica-circulo.component';

describe('GraficaCirculoComponent', () => {
  let component: GraficaCirculoComponent;
  let fixture: ComponentFixture<GraficaCirculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficaCirculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficaCirculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
