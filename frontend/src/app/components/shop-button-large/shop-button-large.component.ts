import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-button-large',
  templateUrl: './shop-button-large.component.html',
  styleUrls: ['./shop-button-large.component.scss']
})
export class ShopButtonLargeComponent implements OnInit {

  @Input() item = { 
    name: 'Insert name here', 
    price: 0,
    image: '',
    purchased: false,
  }

  constructor() { }

  ngOnInit(): void {
  }

}
