import { Component, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Desafio Ripley';
  @Output()
  cargando:boolean;
  @Output()
  loginCorrect:boolean;

  constructor(){
      setTimeout(() => {
          this.cargando = false;
      }, 2000);

  }
}
