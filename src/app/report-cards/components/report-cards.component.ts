import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from 'rxjs/operators';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatHorizontalStepper, MatStep } from '@angular/material/stepper';

import { UiActorSearchResult } from '@app/core';
import { ReportCardsState } from '@app/report-cards/report-cards.model';
import { selectReportCards } from '@app/report-cards/report-cards.selectors';
import { ActionReportCardsActorSearch } from '@app/report-cards/report-cards.actions';
import { ReportCardsService } from '@app/report-cards/report-cards.service';

@Component({
  selector: 'report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.css']
})
/** Top-level presentation component handles Actor and Provider selection and hosts
 * Report Card presentation component.
 */
export class ReportCardsComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  private reportCardsState: ReportCardsState;

  constructor(
    private store: Store<{}>,
    public reportCardService: ReportCardsService
  ) {
    this.store
      .pipe(select(selectReportCards), takeUntil(this.unsubscribe$))
      .subscribe(state => (this.reportCardsState = state));
  }

  actorSearchResults: Array<UiActorSearchResult> = new Array<
    UiActorSearchResult
  >();
  isActorSearchInProgress = false;
  isProviderSearchInProgress = false;

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onSearchStringChange(searchString: string) {
    this.reportCardService.actorSearchString$.next(searchString);
  }
}
