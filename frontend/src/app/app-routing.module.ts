import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './utils/auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { TeacherHomeComponent } from './modules/teacher-home/teacher-home.component';
import { StudentHomeComponent } from './modules/student-home/student-home.component';

const routes: Routes = [
  { 
    path: '', component: AppComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: LandingPageComponent, },
      { path: 'teacher-home', component: TeacherHomeComponent },
      { path: 'student-home', component: StudentHomeComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' } // otherwise redirect to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
