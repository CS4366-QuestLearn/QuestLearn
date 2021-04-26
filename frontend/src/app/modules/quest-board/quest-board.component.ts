import { Component, OnInit } from '@angular/core';
import { QuestService } from 'src/app/utils/quest.service';
import { AuthService } from 'src/app/utils/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quest-board',
  templateUrl: './quest-board.component.html',
  styleUrls: ['./quest-board.component.scss']
})
export class QuestBoardComponent implements OnInit {

  public teamQuests = [];
  public yourQuests = [];

  public loading = true;

  public id;
  public user: gapi.auth2.GoogleUser;

  constructor(
    private questService: QuestService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.id = this.route.snapshot.params.id;
    this.questService.getAllAssignments(this.user, this.id, true)
    .subscribe((response: Array<any>) => {
      console.log('response data')
      console.log(response)
      this.teamQuests = response.filter(x => x.type == 2);
      this.yourQuests = response.filter(x => x.type == 1);
      console.log(this.teamQuests)
      console.log(this.yourQuests)
      this.loading = false
      // this.questService.importQuestsToUser(this.user)
      // .subscribe((status: any) => {
      //   console.log('student data')
      //   console.log(status)
      //   response.forEach(element => {
      //     element.completed = status.quests.find(x => x._id == element._id).completed
      //   });

      //   this.loading = false;
      //   console.log("Student balance for current classroom: " , status.balance)
      // })
    })
  }

}
