import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/utils/auth.service';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: []
})
export class AuthButtonComponent implements OnInit {

  
  returnUrl: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  async ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }


  async authenticate() {
    this.authService.currentUserSubject.subscribe(x => {
      if (x) {
        console.log('subject', x);
        this.router.navigate([this.returnUrl]);
      }
    })
    this.authService.authenticate();
  }
  

}



