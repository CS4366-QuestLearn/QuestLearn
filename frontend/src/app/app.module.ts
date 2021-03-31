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
import { TylerComponentComponent } from './components/tyler-component/tyler-component.component';
import { TeacherHomeTableComponent } from './components/teacher-home-table/teacher-home-table.component';
import { TeacherClassroomTableComponent } from './components/teacher-classroom-table/teacher-classroom-table.component';
import { HttpClientModule } from '@angular/common/http';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button'
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopNavigationBarComponent } from './components/top-navigation-bar/top-navigation-bar.component';
import { AddQuestDialogComponent } from './components/add-quest-dialog/add-quest-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { UpcomingAssignmentComponent } from './components/upcoming-assignment/upcoming-assignment.component';
import { TestingComponent } from './modules/testing/testing.component';

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
    TopNavigationBarComponent,
    TeacherHomeTableComponent,
    TeacherClassroomTableComponent,
    TeacherClassroomComponent,
    AddQuestDialogComponent,
    UpcomingAssignmentComponent,
    TestingComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
