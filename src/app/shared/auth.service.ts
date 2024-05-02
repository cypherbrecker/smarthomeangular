import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable,of, Subscription   } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private currentUserEmailSubject = new BehaviorSubject<string | null>(null);
  currentUserEmail$ = this.currentUserEmailSubject.asObservable();

  private authStateSubscription: Subscription | undefined;

  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
    this.fireauth.authState.subscribe(user => {
      if (user) {
        this.isLoggedInSubject.next(true);
        this.currentUserEmailSubject.next(user.email);
      } else {
        this.isLoggedInSubject.next(false);
        this.currentUserEmailSubject.next(null);
      }
    });
  }

 
  ngOnDestroy(): void {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
      console.log("ngOnDestroy lefutott authban!");
    }
  }



  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }

  // login
  login(email : string, password : string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then( () => {
      localStorage.setItem('token', 'true');
      this.router.navigate(['/dashboard']); //ha bejelentkezek 
    }, err => {
      alert(err.message)
      this.router.navigate(['/login']);
    })
  }
  getCurrentUser(): Observable<any> {
    return this.fireauth.authState;
  }

  getCurrentUserId(): Observable<string | null> {
    return this.fireauth.authState.pipe(
      switchMap(user => {
        return user ? of(user.uid) : of(null); // modositva
      })
    );
  }

  


  //reg
  register(email : string, password : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( () => {
      alert("Sikeres reg!");
      this.router.navigate(['/login']);

    }, err => {
      alert(err.message)
      this.router.navigate(['/register']);
      console.log('Firebase hiba:', err.message);

    })
  }

  //logout
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    });
  }

  async getUserEmail(): Promise<string | null> {
    const user = await this.fireauth.currentUser;
    return user ? user.email : null;
  }
}
