import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/utils/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleService } from 'src/app/utils/google.service';

export interface ClassElement {
  ID: number;
  name: string;
  last_updated: string;
  class_status: string;
}

const ELEMENT_DATA: ClassElement[] = [
  {ID: 1, name: '1st Period Social Studies', last_updated: '3/5/2020', class_status: 'Active'},
  {ID: 2, name: '3rd Period Science', last_updated: '3/5/2019', class_status: 'Inactive'},
  {ID: 3, name: '1st Period Math', last_updated: '6/1/2019', class_status: 'Inactive'},
  {ID: 4, name: '7th Period Math', last_updated: '5/5/2018', class_status: 'Inactive'}
];

@Component({
  selector: 'app-teacher-home-table',
  templateUrl: './teacher-home-table.component.html',
  styleUrls: ['./teacher-home-table.component.scss']
})



export class TeacherHomeTableComponent implements OnInit {
  
  displayedColumns: string[] = ['Open', 'No.', 'name', 'last_updated', 'class_status'];
  public dataSource;
  public user;
  constructor(
    private authService: AuthService,
    private googleService: GoogleService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.googleService.getClassrooms(this.user)
      .subscribe((response: Array<any>) => {
        response.forEach((element, i) => {
          element['No.'] = i + 1
          element.last_updated = new Date(element.updateTime).toLocaleDateString('en-US')
        });
        this.dataSource = response
      })
    
  }

  getRecord(record)
  {
    // TODO: redirect to teacher-home/id
    this.router.navigate([`../class/${record.id}`], {relativeTo: this.route});
  }

}
