import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { AuthButtonComponent } from './components/auth-button/auth-button.component';
import { TeacherHomeComponent } from './modules/teacher-home/teacher-home.component';
import { StudentHomeComponent } from './modules/student-home/student-home.component';
import { TeacherClassroomComponent } from './modules/teacher-classroom/teacher-classroom.component';
import { ClassShopComponent } from './modules/class-shop/class-shop.component';
import { TylerComponentComponent } from './components/tyler-component/tyler-component.component';
import { HttpClientModule } from '@angular/common/http';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button'
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
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
import { TableComponent } from './components/table/table.component';
import { SideNavComponent } from './components/sidenav/sidenav.component';
import { TeacherComponent } from './modules/teacher/teacher.component';
import { StudentComponent } from './modules/student/student.component';
import { QuestBoardComponent } from './modules/quest-board/quest-board.component';
import { QuestComponent } from './components/quest/quest.component';
import { PurchaseConfirmationComponent } from './components/purchase-confirmation/purchase-confirmation.component';
import { AddRewardDialogComponent } from './components/add-reward-dialog/add-reward-dialog.component';
import { ShopButtonLargeComponent } from './components/shop-button-large/shop-button-large.component';
import { AvatarComponent } from './modules/avatar/avatar.component';
import { TestingShopComponent } from './modules/testing-shop/testing-shop.component';
import { RewardNotifsComponent } from './modules/reward-notifs/reward-notifs.component';
import { RedeemNotifComponent } from './components/redeem-notif/redeem-notif.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    AuthButtonComponent,
    TeacherHomeComponent,
    SideNavComponent,
    StudentHomeComponent,
    TylerComponentComponent,
    SignUpComponent,
    TopNavigationBarComponent,
    TeacherClassroomComponent,
    ClassShopComponent,
    AddQuestDialogComponent,
    UpcomingAssignmentComponent,
    TestingComponent,
    TableComponent,
    TeacherComponent,
    StudentComponent,
    QuestBoardComponent,
    QuestComponent,
    PurchaseConfirmationComponent,
    AddRewardDialogComponent,
    ShopButtonLargeComponent,
    AvatarComponent,
    TestingShopComponent,
    RewardNotifsComponent,
    RedeemNotifComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
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
