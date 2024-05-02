import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email : string = '';
  password : string = '';

  constructor(private auth : AuthService) {}

  login() {

    if (this.email == '') {
      alert("Add meg az emailt!");
      return;
    }

    if (this.password == '') {
      alert("Add meg a jelszot!");
      return;
    }

    this.auth.login(this.email, this.password);
    this.email = '';
    this.password = '';

  }

}
