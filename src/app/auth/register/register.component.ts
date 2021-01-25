import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { BaseService } from '../../services/base.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private isValidEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  public usuario: Usuario;
  // public isValidPass: boolean;
  // public formSubmitted: boolean;

  public registerForm: FormGroup;

  constructor(private fb: FormBuilder,private baseService: BaseService, private usuarioService: UsuarioService, private router: Router) {
    this.usuario = new Usuario('','','');
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
      terminos: ['']
    });
  }

  ngOnInit(): void {
  }

  isValidField(field: string){
    return ((this.registerForm.get(field).touched || this.registerForm.get(field).dirty) && !this.registerForm.get(field).valid);
  }

  crearUsuario() {
    this.usuario.nombre = (this.registerForm.get('nombre').value).trim();
    this.usuario.email = this.registerForm.get('email').value;
    this.usuario.password = this.registerForm.get('password').value;

    if ((this.usuario.nombre.length == 0)) {
      this.baseService.msgError('No puede enviar el nombre vacío.');
      return;
    }
    if ((this.usuario.nombre.length < 3)) {
      this.baseService.msgError('Mínimo debe escribir 3 caracteres.');
      return;
    }

    if(this.registerForm.invalid) {
      return;
    }
    this.usuarioService.crearUsuario(this.usuario).subscribe(
      res => {
        console.log(res);
        this.baseService.msgSuccess(res.msg)
        /**redirigir a dashboard */
        this.router.navigateByUrl('/');
      },
      err => {
        console.warn(err);
        this.baseService.msgError(err.error.msg);
      }
    )
  }

  validarPassword(): boolean {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;
    if (pass1 === pass2) {
      return false;
    } else {
      return true;
    }
  }
}
