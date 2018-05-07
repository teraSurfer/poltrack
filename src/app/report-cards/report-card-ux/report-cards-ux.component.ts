import { Component, OnInit } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatHorizontalStepper, MatStep } from '@angular/material/stepper';

import { SearchInputComponent } from '@app/shared/search/search-input.component';

@Component({
  selector: 'report-cards-ux',
  templateUrl: './report-cards-ux.component.html',
  styleUrls: ['./report-cards-ux.component.css']
})
export class ReportCardsUxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
