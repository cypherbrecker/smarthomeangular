import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userEmail!: string | null;
  pythonMessage: string = '';

  constructor(private auth: AuthService, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    await this.getUserEmail();
  //  await this.getPythonMessage();
  }

  
  async getUserEmail(): Promise<void> {
    try {
      this.userEmail = await this.auth.getUserEmail();
    } catch (error) {
      console.log('email error!', error);
    }
  }



  register() {
    this.auth.logout();
  }

}
