import { Hospital } from './hospital';
interface _medicoUser {
  _id: string;
  nombre: string;
  foto: string;
}

export class Medico {
  constructor(
    public _id: string,
    public nombre: string,
    public enabled: string,
    public usuario: _medicoUser,
    public hospital?: Hospital,
    public foto?: string,
  ){}

}