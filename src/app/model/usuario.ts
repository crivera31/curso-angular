import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password: string,
    public enabled?: string,
    public foto?: string,
    public google?: boolean,
    public role?: 'ADMIN_ROLE' | 'USER_ROLE',
    public uid?: string
  ){}

  ImprimirNombre() {
    console.log(this.foto);
  }
  get FotoUrl() {
    // /upload/usuarios/no-imgage
    if(!this.foto) {
      return `${base_url}/uploads/usuarios/no-image`;
    } else if(this.foto.includes('https')) {
      return this.foto;
    } else if(this.foto) {
      return `${base_url}/uploads/usuarios/${this.foto}`;
    } else {
      return `${base_url}/uploads/usuarios/no-image`;
    }
  }
}