import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// import { Login } from './login';
// import { LoginsService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    formLogin: FormGroup;
    loginCorrect: Boolean = null;
    cargando: boolean = true;
    message: String = "";
    // LoginsService: LoginsService
    // loginVar: Login[];

    constructor(
      private creadorFormulario: FormBuilder,
    //   private loginsService: LoginsService
    ) {}

  ngOnInit(): void {
      this.formLogin = this.creadorFormulario.group({
          rut:['', Validators.compose([
              Validators.required,
          ])],
          clave:['', Validators.required,]
      });
  }

  login(){
      if(this.formLogin.valid){
          this.cargando = false;
          setTimeout(() => {
          this.cargando = true;
      }, 2000);
          this.loginCorrect = true;
          let rut = this.formLogin.value.rut
          let clave = this.formLogin.value.clave
          console.log(`${rut} ${clave}`);
          this.message = "Ingresando ..."
      } else {
        this.loginCorrect = false;
        this.message = "Usuario o clave incorrecta."

      }

      

  }

//   getLogins(): void {
//     this.loginsService.getLogins()
//       .subscribe(logins => (this.loginVar = logins));
//   }

}
