import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
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
import {
  MatSelect,
  MatOption,
  MatListOption,
  MatSelectionList
} from '@angular/material';

@Component({
  selector: 'report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.css']
})
/** Top-level presentation component handles Actor and Provider selection and hosts
 * Report Card presentation component.
 */
export class ReportCardsComponent implements OnInit, OnDestroy {
  @ViewChild('actorSearchResultList')
  actorSearchResultList: MatSelectionList;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(public reportCardsService: ReportCardsService) {}

  actors$: Observable<Array<Actor>>;

  ngOnInit() {
    this.actors$ = this.reportCardsService.actors$;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onActorSelectionChanged({ option: o, source: s }) {
    const toggledActorSearchResult: ActorSearchResult = o.value;

    if (o.selected) {
      this.reportCardsService.upsertActor(toggledActorSearchResult.item);
    } else {
      this.reportCardsService.deleteActor(toggledActorSearchResult.item.id);
    }
  }

  onDeletePersonClicked(event) {
    const actorId: string = event.currentTarget.value;
    this.reportCardsService.deleteActor(actorId);

    this.actorSearchResultList.options.forEach(
      (searchResult: MatListOption) => {
        if (searchResult.value.id === actorId) {
          searchResult.selected = false;
        }
      }
    );
  }

  onSearchStringChange(searchString: string) {
    this.reportCardsService.actorSearchString$.next(searchString);
  }
}
