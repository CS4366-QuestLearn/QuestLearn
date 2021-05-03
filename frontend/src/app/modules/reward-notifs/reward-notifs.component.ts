import { Component, OnInit } from '@angular/core';
import { QuestService } from 'src/app/utils/quest.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reward-notifs',
  templateUrl: './reward-notifs.component.html',
  styleUrls: ['./reward-notifs.component.scss']
})
export class RewardNotifsComponent implements OnInit {
  public id
  public requests
  public loading = true
  constructor(
    private questService: QuestService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.questService.getAllRequests(this.id).subscribe((x: Array<any>) => {
      this.requests = x.filter(x => x.status == -1)
      console.log(this.requests)
      this.loading = false
    });
  }

  submitted(){
    this.questService.getAllRequests(this.id).subscribe((x: Array<any>)  => {
      this.requests = x.filter(x => x.status == -1)
    });
  }

}
