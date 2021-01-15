import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {
  public subirFoto: File;
  public imgTemp: any;
  public usuario: Usuario;

  constructor(public baseService: BaseService, private fileUploadService: FileUploadService, private usuarioService: UsuarioService ) {
    this.usuario = this.usuarioService.usuario;
    this.imgTemp = '';
  }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = '';
    this.baseService.cerrarModal();
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
  subirAvatar() {
    const id = this.baseService.id;
    const tipo = this.baseService.tipo;
    this.fileUploadService.actualizarFoto(this.subirFoto,tipo,id).then(
      res => {
        // console.log(res);
        if (res.ok) {
          // this.usuario.foto = res.nombreArchivo; /**mi forma */
          // this.baseService.msgSuccess(res.msg);
          this.baseService.nuevaImg.emit(res.nombreArchivo);
          this.cerrarModal();
        } 
        // else {
        //   this.baseService.msgError(res.msg);
        // }
      }).catch( err => {
        console.log(err);
      });
  }

}
