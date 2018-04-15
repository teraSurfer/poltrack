import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vispt-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit {
  // tslint:disable-next-line:no-submodule-imports
  themeSrc: string = require('!raw-loader!./parent.component.scss-theme.scss');

  constructor() {}

  ngOnInit() {}
}
