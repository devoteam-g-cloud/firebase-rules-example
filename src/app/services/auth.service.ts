import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import * as angularfire from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  private idToken: string | null = null;
  claims: any;
  authenticationState = new Subject<any>();
  //private userDataSource = new BehaviorSubject(null);
  //userState = this.userDataSource.asObservable();
  user$: Observable<angularfire.User | null> | any;
  constructor(private afAuth: AngularFireAuth, private http: HttpClient, private router: Router,
    private auth: angularfire.Auth) {
      this.user$ = angularfire.authState(auth);
      angularfire.authState(auth).subscribe(async user => {
      if (user) {
        this.idToken = await user.getIdToken(true);
        this.claims = (await user.getIdTokenResult(true) as any).claims;
        this.user = user;
        this.authenticationState.next(this.claims);
      } else {
        this.user = null;
        this.idToken = null;
        this.claims = null;
        this.authenticationState.next(this.claims);
      }
    });
  }

  async getUser(): Promise<angularfire.User | null> {
    return await this.user$.pipe(take(1));
  }

  currentUser() {
    var obj = {
      user: this.user,
      claims: this.claims
    }
    return obj;
  }



  async signInWithPopup() {
    const provider = new angularfire.GoogleAuthProvider();
    provider.setCustomParameters({
      'prompt': 'select_account',
      'access_type': 'online'
    });
    return new Promise<void>(() => {
      angularfire.signInWithPopup(this.auth, provider).then(async (userCred: any) => {
        const idToken = await userCred.user.getIdToken(true);
        try {
          this.user = userCred.user;
          this.idToken = await this.user.getIdToken();
          this.claims = (await this.user.getIdTokenResult() as any).claims;
          this.authenticationState.next(this.claims);
          this.router.navigate(['']);
        } catch (err) {
          console.log("err :", err)
          this.authenticationState.next(null);
        }
      }).catch((e) => {
        console.log("e?", e);
      })
    });
  }

  logout() {
    window.sessionStorage.clear();
    angularfire.signOut(this.auth).then(r => {
      this.user = null;
      this.user$ = null;
      this.idToken = null;
      this.claims = null;
      this.authenticationState.next(this.claims);
      this.router.navigate(['login']);
    })
  }


  async isLoggedIn(): Promise<boolean> {
    // only use in code, use observable in template
    return !! await this.user$.pipe(take(1))
  }


  get role(): any {
    if (!this.user) {
      return null;
    }
    return this.claims.role;
  }

 

}
