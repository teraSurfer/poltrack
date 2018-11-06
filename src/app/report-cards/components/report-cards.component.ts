import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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

import { ReportCardsService } from '@app/report-cards/report-cards.service';
import { Actor, ActorSearchResult } from '../actors.model';
import { selectAllActors, selectSelectedActor } from '../actors.selectors';
import {
  ActionActorsUpsertOne,
  ActionActorsDeleteOne
} from '../actors.actions';

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

  constructor(
    private store: Store<{}>,
    public reportCardService: ReportCardsService
  ) {}

  actors$: Observable<Array<Actor>>;
  selectedActor: Actor;
  actorSearchResults: Array<ActorSearchResult> = new Array<ActorSearchResult>();
  isActorSearchInProgress = false;
  isProviderSearchInProgress = false;

  ngOnInit() {
    this.actors$ = this.store.pipe(select(selectAllActors));
    // this.store
    //   .pipe(
    //     select(selectSelectedActor),
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe(actor => (this.selectedActor = actor));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onActorSelectionChanged({ option: o, source: s }) {
    const toggledActorSearchResult: ActorSearchResult = o.value;

    if (o.selected) {
      this.store.dispatch(
        new ActionActorsUpsertOne({ actor: toggledActorSearchResult.item })
      );
      // this.reportCardService.upsertActor(toggledActorSearchResult.item);
    } else {
      this.store.dispatch(
        new ActionActorsDeleteOne({ id: toggledActorSearchResult.item.id })
      );
      // this.reportCardService.deleteActor(toggledActorSearchResult.item.id);
    }
  }

  onSearchStringChange(searchString: string) {
    this.reportCardService.actorSearchString$.next(searchString);
  }
}
