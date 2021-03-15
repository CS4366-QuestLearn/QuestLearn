import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './utils/auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { TeacherHomeComponent } from './modules/teacher-home/teacher-home.component';

const routes: Routes = [
  // { path: '', component: LandingPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'teacher-home', component: TeacherHomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
