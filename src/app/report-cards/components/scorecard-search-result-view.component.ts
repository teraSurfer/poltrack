import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActorProviderScorecardSearchResult } from '../report-cards-config.model';

@Component({
  selector: 'vispt-scorecard-search-result-view',
  templateUrl: './scorecard-search-result-view.component.html',
  styleUrls: ['./scorecard-search-result-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScorecardSearchResultViewComponent implements OnInit {

  constructor() { }

  @Input() scorecardIds$: Observable<Array<string>>;
  @Input() scorecardSearchResult$: Observable<Array<ActorProviderScorecardSearchResult>>;
  @Output() scorecardSelected = new EventEmitter<string>();
  @Output() scorecardUnselected = new EventEmitter<string>();

  scorecardsDataSource$: Observable<Array<ActorProviderScorecardSearchResult>>;

  ngOnInit() {
    this.scorecardsDataSource$ = combineLatest(
      this.scorecardIds$,
      this.scorecardSearchResult$
    ).pipe(
      map(
        ([scorecardIds, searchResults]) => {
          // to speed up look up, put scorecardIds in a map
          const scorecardIdsMap: Map<string, number> = new Map<string, number>();
          scorecardIds.forEach((value, index) => { scorecardIdsMap.set(value, index); });

          // set checkbox to checked for each scorecard in the map
          searchResults.forEach((scorecardItem) => {
            if (scorecardIdsMap.get(scorecardItem.id) === undefined) {
              scorecardItem.isSelected = false;
            } else {
              scorecardItem.isSelected = true;
            }
          });

          return searchResults;
        }
      )
    );
  }

  onScorecardSearchResultClicked(ev: MouseEvent) {
    const isScorecardCheckboxChecked = (<HTMLDivElement>ev.currentTarget).getElementsByTagName('input')[0].checked;
    const checkboxElement: HTMLInputElement = (<HTMLDivElement>ev.currentTarget).getElementsByTagName('input')[0];
    const scorecardId = checkboxElement.value;

    if (isScorecardCheckboxChecked) {
      this.scorecardUnselected.emit(scorecardId);
    } else {
      this.scorecardSelected.emit(scorecardId);
    }
  }
}
