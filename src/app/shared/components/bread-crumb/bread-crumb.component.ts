import { Component, OnInit, Input } from '@angular/core';

import { BreadCrumbItem } from './../../models/breadcrumb-item.model';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  @Input() items: BreadCrumbItem[] = [];

  constructor() { }

  ngOnInit() {
  }

  isLastItem(item: BreadCrumbItem): boolean {
    return (this.items.indexOf(item) + 1) == this.items.length;
  }

}
