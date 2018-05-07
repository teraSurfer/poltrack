import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
@Input() placeholder = 'What are you looking for?';

  constructor() { }

  ngOnInit() {
  }

}
