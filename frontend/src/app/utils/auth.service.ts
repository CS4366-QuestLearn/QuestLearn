import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  public currentUserSubject: BehaviorSubject<gapi.auth2.GoogleUser>;
  public currentUser: Observable<any>;

  public gapiSetup: boolean = false; // marks if the gapi library has been loaded
  public authInstance: gapi.auth2.GoogleAuth;
  public error: string;
  public user: gapi.auth2.GoogleUser;
  public data: any = {response: "No data yet"};
  public initialized = false;

  constructor() {
    try {
      this.currentUserSubject = new BehaviorSubject<any>(
        JSON.parse(localStorage.getItem("currentUser"))
      );
    }
    catch (e) {
      console.log(e);
      console.log("Unexpected token - Resetting currentUser...");
      localStorage.removeItem("currentUser");
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  async checkUser() {
    if (await this.checkIfUserAuthenticated()) {
      this.user = this.authInstance.currentUser.get();
      if (!this.initialized) {
        this.currentUserSubject.next(this.user);
        this.initialized = true;
      }
    } else {
      this.logout();
    }
  }

  async initGoogleAuth(): Promise<void> {
    //  Create a new Promise where the resolve function is the callback
    // passed to gapi.load
    const pload = new Promise((resolve) => {
      gapi.load('auth2', resolve);
    });

    // When the first promise resolves, it means we have gapi loaded
    // and that we can call gapi.init
    return pload.then(async () => {
      await gapi.auth2
        .init({
          client_id: '358049124735-nh8u2f4n8i0uu1183vugsgd5lcm2unh3.apps.googleusercontent.com', 
          scope: 'https://www.googleapis.com/auth/classroom.courses.readonly'
        }).then(auth => {
          this.gapiSetup = true;
          this.authInstance = auth;
        });
    });
    
  }

  async authenticate(): Promise<gapi.auth2.GoogleUser> {
    // Initialize gapi if not done yet
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }

    // Resolve or reject signin Promise
    return new Promise(async () => {
      await this.authInstance.signIn().then(
        user => this.user = user,
        error => this.error = error
        );

        console.log(this.user);

        this.currentUserSubject.next(this.user);
        localStorage.setItem('currentUser', JSON.stringify(this.user));
    });
  }

  async checkIfUserAuthenticated(): Promise<boolean> {
    // Initialize gapi if not done yet
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }

    return this.authInstance.isSignedIn.get();
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.authInstance.signOut();
  }
}
