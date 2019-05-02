import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ActorProviderScorecardSearchResult } from '../report-cards-config.model';

@Component({
  selector: 'vispt-scorecard-action-search-result-view',
  templateUrl: './scorecard-action-search-result-view.component.html',
  styleUrls: ['./scorecard-action-search-result-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScorecardActionSearchResultViewComponent implements OnInit {

  constructor() { }

  @Input() scorecardIds: Array<string>;
  @Input() actionIds$: Observable<Array<string>>;
  @Input() scorecardActionSearchResult$: Observable<Array<ActorProviderScorecardSearchResult>>;

  ngOnInit() {
  }

}
