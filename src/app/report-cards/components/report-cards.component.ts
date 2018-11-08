import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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

import { ReportCardsService } from '@app/report-cards/report-cards.service';
import { Actor, ActorSearchResult } from '../actors.model';

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

  constructor(public reportCardService: ReportCardsService) {}

  actors$: Observable<Array<Actor>>;

  ngOnInit() {
    this.actors$ = this.reportCardService.actors$;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onActorSelectionChanged({ option: o, source: s }) {
    const toggledActorSearchResult: ActorSearchResult = o.value;

    if (o.selected) {
      this.reportCardService.upsertActor(toggledActorSearchResult.item);
    } else {
      this.reportCardService.deleteActor(toggledActorSearchResult.item.id);
    }
  }

  onSearchStringChange(searchString: string) {
    this.reportCardService.actorSearchString$.next(searchString);
  }
}
