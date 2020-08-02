import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  @Input('page-title') pageTitle: string;
  @Input('button-class') buttonClass: string = 'btn-success';
  @Input('button-text') buttonText: string;
  @Input('button-link') buttonLink: string;

  constructor() { }

  ngOnInit() {
  }

}