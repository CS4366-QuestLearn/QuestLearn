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
import { TeacherClassroomComponent } from './modules/teacher-classroom/teacher-classroom.component';
import { ClassShopComponent } from './modules/class-shop/class-shop.component';
import { TylerComponentComponent } from './components/tyler-component/tyler-component.component';
import { TopNavigationBarComponent } from './components/top-navigation-bar/top-navigation-bar.component';
import { TeacherHomeTableComponent } from './components/teacher-home-table/teacher-home-table.component';
import { TeacherClassroomTableComponent } from './components/teacher-classroom-table/teacher-classroom-table.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button'
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

const material = {
  MatSidenavModule,
  MatButtonModule,
  MatTableModule,
  MatSelectModule
};

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
    TopNavigationBarComponent,
    TeacherHomeTableComponent,
    TeacherClassroomTableComponent,
    TeacherClassroomComponent,
    ClassShopComponent,
  ],
  exports: [MatSidenavModule,
    MatButtonModule,
    MatTableModule,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
