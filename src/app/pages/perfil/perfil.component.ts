import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/services/base.service';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private isValidEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  public perfilForm: FormGroup;
  public usuario:Usuario;
  public subirFoto: File;
  public imgTemp: any = '';

  constructor(private fb: FormBuilder, private fileUploadService: FileUploadService ,private usuarioService: UsuarioService, private baseService: BaseService) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required, Validators.minLength(3)]],
      email: [this.usuario.email, [Validators.required, Validators.pattern(this.isValidEmail)]],
    });
  }

  isValidField(field: string){
    return ((this.perfilForm.get(field).touched || this.perfilForm.get(field).dirty) && !this.perfilForm.get(field).valid);
  }

  onActualizarPerfil() {
    // console.log(this.perfilForm.value);
    this.usuarioService.actualizarUsuario(this.perfilForm.value).subscribe(
      res => {
        console.log(res);
        const { nombre, email } = res.usuario;
        /**para actualizalo sin recargar 187 */
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        this.baseService.msgSuccess(res.msg);
      }
    )
  }
  cambiarFoto(file: File) {
    this.subirFoto = file;
    if (!file) { return; }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }
  onSubirFoto() {
    this.fileUploadService.actualizarFoto(this.subirFoto,'usuarios',this.usuario.uid).then(
      res => {
        console.log(res);
        // this.usuario.foto = res;
        if (res.ok) {
          this.usuario.foto = res.nombreArchivo; /**mi forma */
          this.baseService.msgSuccess(res.msg);
        } else {
          this.baseService.msgError(res.msg);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
