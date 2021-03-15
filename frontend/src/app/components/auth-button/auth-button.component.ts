import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: []
})
export class AuthButtonComponent implements OnInit {

  public gapiSetup: boolean = false; // marks if the gapi library has been loaded
  public authInstance: gapi.auth2.GoogleAuth;
  public error: string;
  public user: gapi.auth2.GoogleUser;
  public data: any = {response: "No data yet"};

  constructor(
  ) {

  }

  async ngOnInit() {
    if (await this.checkIfUserAuthenticated()) {
      this.user = this.authInstance.currentUser.get();
      const option = new gapi.auth2.SigninOptionsBuilder();
      // console.log(option)
      //option.setScope('email https://www.googleapis.com/auth/classroom.courses.readonly');
      //this.user.grant(option)
      console.log(this.user)
      // gapi.auth2.authorize({client_id: '358049124735-nh8u2f4n8i0uu1183vugsgd5lcm2unh3.apps.googleusercontent.com', response_type: 'id_token permission', scope: 'email profile openid',}, function(response) {
      // 
      //
      // })
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
          console.log(this.user)
        });
    });
  }

  // async initGoogleAuth(): Promise<void> {
  //   //  Create a new Promise where the resolve function is the callback
  //   // passed to gapi.load
  //   const pload = new Promise((resolve) => {
  //     gapi.load('auth2', resolve);
  //   });

  //   // When the first promise resolves, it means we have gapi loaded
  //   // and that we can call gapi.init
  //   return pload.then(async () => {
  //     await gapi.auth2
  //       .authorize({client_id: '358049124735-nh8u2f4n8i0uu1183vugsgd5lcm2unh3.apps.googleusercontent.com', response_type: 'id_token permission', scope: 'email profile openid',}, function(response) {
  //         this.gapiSetup = true;
  //         this.authInstance = response;
  //       });
  //   });
  // }

  async authenticate(): Promise<gapi.auth2.GoogleUser> {
    // Initialize gapi if not done yet
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }

    // Resolve or reject signin Promise
    return new Promise(async () => {
      await this.authInstance.signIn().then(
        user => this.user = user,
        error => this.error = error);
    });
  }

  async checkIfUserAuthenticated(): Promise<boolean> {
    // Initialize gapi if not done yet
    if (!this.gapiSetup) {
      await this.initGoogleAuth();
    }

    return this.authInstance.isSignedIn.get();
  }
}



