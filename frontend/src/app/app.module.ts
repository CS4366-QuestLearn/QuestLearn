import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';
import { TeacherHomeComponent } from './modules/teacher-home/teacher-home.component';
import { NickComponentComponent } from './components/nick-component/nick-component.component';
import { StudentHomeComponent } from './modules/student-home/student-home.component';
import { TylerComponentComponent } from './components/tyler-component/tyler-component.component';
import { HttpClientModule } from '@angular/common/http'; 
import { MatButtonModule } from '@angular/material/button'
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    AuthButtonComponent,
    TeacherHomeComponent,
    NickComponentComponent,
    StudentHomeComponent,
    TylerComponentComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
