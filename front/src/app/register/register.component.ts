import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    formLogin: FormGroup;
    loginCorrect: Boolean = null;
    cargando: boolean = true;
    message: String = "";

  constructor(private creadorFormulario: FormBuilder,) { }

  ngOnInit(): void {
      this.formLogin = this.creadorFormulario.group({
          rut:['', Validators.compose([
            Validators.required,
          ])],
          email: ['', Validators.compose([
            Validators.required, Validators.email
          ])],
          clave:['', Validators.required,]
      });
  }

}
