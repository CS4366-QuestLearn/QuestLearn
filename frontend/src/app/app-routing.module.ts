import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

// Guards
import { AuthGuard } from './utils/auth.guard';
import { DevGuard } from './utils/dev.guard';

// Components
import { LoginComponent } from './modules/login/login.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { TeacherHomeComponent } from './modules/teacher-home/teacher-home.component';
import { TeacherClassroomComponent } from './modules/teacher-classroom/teacher-classroom.component';
import { StudentHomeComponent } from './modules/student-home/student-home.component';
import { TestingComponent } from './modules/testing/testing.component';
import { TeacherComponent } from './modules/teacher/teacher.component';
import { StudentComponent } from './modules/student/student.component';
import { QuestBoardComponent } from './modules/quest-board/quest-board.component';

const routes: Routes = [
  { 
    path: '',
    component: AppComponent,
    canActivateChild: [AuthGuard],
    children: [
      { 
        path: '',
        component: LandingPageComponent,
        children: [
          { 
            path: 'teacher',
            component: TeacherComponent,
            children: [
              { path: 'home', component: TeacherHomeComponent },
              { path: 'class/:id', component: TeacherClassroomComponent },
            ]
          },
          { 
            path: 'student',
            component: StudentComponent,
            children: [
              { path: 'home', component: StudentHomeComponent },
              { path: 'class/:id', component: QuestBoardComponent },
            ]
          },
        ]
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { 
    path: 'sandbox',
    canActivateChild: [DevGuard],
    children: [
      { path: 'testing', component: TestingComponent },
      { path: 'tyler', component: QuestBoardComponent },
    ]
  },
  { path: '**', redirectTo: '' } // otherwise redirect to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
