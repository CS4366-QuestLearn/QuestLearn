import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AddQuestDialogComponent } from '../add-quest-dialog/add-quest-dialog.component';
import { ManageBalanceDialogComponent } from '../manage-balance-dialog/manage-balance-dialog.component';



@Component({
  selector: 'questlearn-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() id;
  @Output() save = new EventEmitter();
  opened = false;
  
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openQuestDialog() {
    const dialogRef = this.dialog.open(AddQuestDialogComponent, {
      
      minHeight: '50%',
      minWidth: '30%',
      data: {id: this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result) {
        this.save.emit('newquest')
      }
    });
  }

  openBalanceDialog() {
    const dialogRef = this.dialog.open(ManageBalanceDialogComponent, {
      data: {id: this.id},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result) {
        this.save.emit('alterbalance')
      }
    });
  }

  navigateToRequests() {
    this.router.navigate([`./manage-requests`], {relativeTo: this.route});
  }

}
