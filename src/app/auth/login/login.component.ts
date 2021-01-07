import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { BaseService } from 'src/app/services/base.service';
import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private isValidEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  public usuario: Usuario;
  public auth2: any;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
    password: ['', [Validators.required]],
  });
  constructor(private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService, private baseService: BaseService, private ngZone: NgZone) {
    this.usuario = new Usuario('','','');
  }

  ngOnInit(): void {
    this.renderButton();
  }

  isValidField(field: string): boolean {
    return ((this.loginForm.get(field).touched || this.loginForm.get(field).dirty) && !this.loginForm.get(field).valid);
  }

  login():void {
    this.usuario.email = this.loginForm.get('email').value;
    this.usuario.password = this.loginForm.get('password').value;    
    this.usuarioService.login(this.usuario).subscribe(
      res => {
        // console.log(res);
        /**redirigir a dashboard */
        this.router.navigateByUrl('/');
        this.baseService.msgSuccess(res.msg);
      },
      err => {
        console.log(err);
        this.baseService.msgError(err.error.msg);
      }
    );
  }

  /**login goole */
  onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    
  }
  onFailure(error) {
    console.log(error);
  }
  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });
    this.startApp();
  }
  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  };
  attachSignin(element) {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          console.log("Signed in: " +
          googleUser.getBasicProfile().getName());

          var id_token = googleUser.getAuthResponse().id_token;/**token q te da google al loguearme */
          console.log('ID_TOKEN: ' + id_token);
          this.usuarioService.loginGoogle(id_token).subscribe(
            resp => {
            this.auth2.disconnect();
            /**redirigir a dashboard */
            this.ngZone.run(() => {
              this.router.navigateByUrl('/');
              this.baseService.msgSuccess('Usuario ' +googleUser.getBasicProfile().getName()+ ' autenticado.');
            });
          });
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }
  

}
