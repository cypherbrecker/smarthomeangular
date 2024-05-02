import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { Subscription, Observable, from, concatMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
export class InformationsComponent {

  userEmail!: string | null;
  pythonMessage: string = '';
  private authSubscription: Subscription | undefined;

  devices: { name: string }[] = [];

  constructor(private auth: AuthService, private http: HttpClient, private firestore: AngularFirestore) {
    this.authSubscription = this.auth.currentUserEmail$.subscribe(email => {
      this.userEmail = email;
    });
  }

  getDevicesForCurrentUser(): Observable<any[]> {
    return from(this.auth.getCurrentUserId()).pipe(
      concatMap((userId: any) => { 
        if (userId) {
          return this.firestore.collection('UserDevice').doc(userId).collection('Device', ref => ref.orderBy('name')).valueChanges();
        } else {
          console.log("Nincs bejelentkezett felhasználó!");
          return new Observable<any[]>(observer => {
            observer.next([]); // ures tomb return, ha user nincs belepve
            observer.complete();
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async ngOnInit(): Promise<void> {
    if (!this.userEmail) {
      await this.getUserEmail();
    }
  }

  async getUserEmail(): Promise<void> {
    try {
      const userEmail = await this.auth.getUserEmail();
      if (userEmail !== null) {
        this.userEmail = userEmail;
        localStorage.setItem('userEmail', this.userEmail);
      }
    } catch (error) {
      console.log('email error!', error);
    }
  }

 /* async getPythonMessage(): Promise<void> {
    try {
      const data = await this.http.get<any>('http://localhost:8000/api/message').toPromise();
      this.pythonMessage = data.message;
    } catch (error) {
      console.log('Error getting Python message:', error);
    }
  }*/

  register() {
    this.auth.logout();
  }

}
