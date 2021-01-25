import { NgModule } from '@angular/core';
import { FotoHospitalPipe } from './foto-hospital.pipe';



@NgModule({
  declarations: [FotoHospitalPipe],
  exports: [FotoHospitalPipe] 
})
export class PipesModule { }
