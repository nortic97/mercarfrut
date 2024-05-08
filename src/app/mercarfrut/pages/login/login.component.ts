import {Component, ViewEncapsulation} from '@angular/core';
import {LoaderServiceService, PopUpsService, UserModel, UserService} from "../../../common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';
import {Router} from "@angular/router";

declare var MainJS: any;
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  constructor(
    private formBuilder: FormBuilder,
    private userRepository: UserService,
    private loaderService: LoaderServiceService,
    private alerts: PopUpsService,
    private router: Router,
  ) {
  }

  public userForm: FormGroup = this.formBuilder.group({
    fullName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]]
  })

  public loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]]
  })

  ngOnInit(): void {
    this.scripts()
  }

  createUser(): void {
    this.loaderService.display(true);
    if (this.userForm.valid) {
      let userData = this.userForm.value as UserModel
      userData.uuid = uuidv4();
      userData.role = 'user';
      this.userRepository.adduser(userData)
      this.loaderService.display(false)
      this.alerts.showAlert("¡Éxito!", "Se ha completado la operación con éxito.", "success")
      this.loginForm.controls['email'].setValue(this.userForm.controls['email'].value);
      this.userForm.reset();
      $('#login').click()
    } else {
      this.loaderService.display(false)
      this.alerts.showAlert("Error!", "El formulario es invalido.", "error")
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loaderService.display(true)
      this.userRepository.getUser(this.loginForm.controls['email'].value).then(r => {
        if (r != null) {
          if (r.password == this.loginForm.controls['password'].value) {
            sessionStorage.setItem('user', JSON.stringify(r));
            this.loaderService.display(false)
            this.router.navigate(['']);
            this.loginForm.reset();
          } else {
            this.loaderService.display(false)
            this.alerts.showAlert("Error!", "Contraseña Incorrecta", "error")
          }
        } else {
          this.loaderService.display(false)
          this.alerts.showAlert("Error!", "El usuario no existe o es invalido", "error")
        }
      })
    } else {
      this.loaderService.display(false)
      this.alerts.showAlert("Error!", "El formulario es invalido.", "error")
    }
  }

  scripts(): void {
    MainJS.init();
  }
}
