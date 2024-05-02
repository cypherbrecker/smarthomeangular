import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email : string = '';
  password : string = '';

  constructor (private auth : AuthService) {}

  
  register() {

    if (this.email == '') {
      alert("Add meg az emailt!");
      return;
    }

    if (this.password == '') {
      alert("Add meg a jelszot!");
      return;
    }

    this.auth.register(this.email, this.password);
    this.email = '';
    this.password = '';

  }

}
