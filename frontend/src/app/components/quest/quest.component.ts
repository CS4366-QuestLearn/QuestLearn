import { Component, Input, OnInit } from '@angular/core';
import { QuestService } from 'src/app/utils/quest.service';
import { AuthService } from 'src/app/utils/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss']
})
export class QuestComponent implements OnInit {
  @Input() data;
  public user: gapi.auth2.GoogleUser;
  public id
  constructor(
    private questService: QuestService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  turnIn() {
    this.user = this.authService.currentUserValue;
    this.id = this.route.snapshot.params.id;
    this.questService.turnInQuest(this.user, this.data._id, this.data.reward_amount, this.id)
    .subscribe(response => {
      // can also do this.data.completed = response.completed
      this.data.completed = true
      console.log(response)
    })
  }


}
