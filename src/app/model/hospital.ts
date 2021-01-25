interface _hospitalUser {
  _id: string;
  nombre: string;
  foto: string;
}

export class Hospital {
  constructor(
    public nombre: string,
    public enabled: string,
    public _id: string,
    public usuario: _hospitalUser,
    public foto?: string
  ){}

}