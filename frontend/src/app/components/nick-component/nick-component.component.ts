import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nick-component',
  templateUrl: './nick-component.component.html',
  styleUrls: ['./nick-component.component.scss']
})
export class NickComponentComponent implements OnInit {
  opened = false;
  constructor() { }

  ngOnInit(): void {
  }

}
