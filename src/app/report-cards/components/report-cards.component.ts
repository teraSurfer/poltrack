import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatVerticalStepper, MatStep } from '@angular/material/stepper';
import {
  MatSelect,
  MatOption,
  MatListOption,
  MatSelectionList
} from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';

import { ReportCardsService } from '@app/report-cards/report-cards.service';
import { Actor, ActorSearchResult } from '../actors.model';
import {
  MAX_ACTORS,
  MIN_ACTORS,
  NO_ACTOR_SELECTED_ERROR_MSG,
  SPINNER_DIAMETER
} from '../constants';
import { ActorInfoProviderScorecardSearchResult } from '../provider-scorecards.model';

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

  @ViewChild('providerScorecardSearchResultList')
  providerScorecardSearchResultList: MatSelectionList;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(public reportCardsService: ReportCardsService) { }

  maxActors = MAX_ACTORS;
  minActors = MIN_ACTORS;
  noActorSelectedMessage = NO_ACTOR_SELECTED_ERROR_MSG;
  spinnerDiameter = SPINNER_DIAMETER;

  actors$: Observable<Array<Actor>>;

  ngOnInit() {
    this.actors$ = this.reportCardsService.reportCardsConfigTreeDataSource$;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onActorSelectionChanged({ option: o, source: s }) {
    const toggledActorSearchResult: ActorSearchResult = o.value;

    if (o.selected) {
      o.selected = this.reportCardsService.tryUpsertActor(
        toggledActorSearchResult.item
      );
    } else {
      this.reportCardsService.deleteActor(toggledActorSearchResult.item.id);
    }
  }

  onProviderScorecardSelectionChanged({ option: o, source: s }) {
    const toggledProviderScorecardSearchResult: ActorInfoProviderScorecardSearchResult =
      o.value;

    if (o.selected) {
      this.reportCardsService.upsertProviderScorecard(
        toggledProviderScorecardSearchResult.item
      );
    } else {
      this.reportCardsService.deleteProviderScorecard(
        toggledProviderScorecardSearchResult.item.id
      );
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

  onDeleteProviderScorecardClicked(event) {
    const providerScorecardId: string = event.currentTarget.value;
    this.reportCardsService.deleteProviderScorecard(providerScorecardId);

    this.providerScorecardSearchResultList.options.forEach(
      (searchResult: MatListOption) => {
        if (searchResult.value.id === providerScorecardId) {
          searchResult.selected = false;
        }
      }
    );
  }

  onSearchStringChange(searchString: string) {
    this.reportCardsService.actorSearchString$.next(searchString);
  }
}
