import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Subject, Observable, fromEvent } from 'rxjs';

import {
  MatExpansionPanel,
  MatAccordion,
  MatExpansionPanelHeader,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatVerticalStepper, MatStep } from '@angular/material/stepper';
import {
  MatSelect,
  MatOption,
  MatListOption,
  MatSelectionList,
  MatTabChangeEvent
} from '@angular/material';

import { ReportCardsService } from '@app/report-cards/report-cards.service';
import { Actor, ActorSearchResult } from '../actors.model';
import {
  MAX_ACTORS,
  MIN_ACTORS,
  NO_ACTOR_SELECTED_ERROR_MSG,
  SPINNER_DIAMETER,
  NO_ACTOR_PANEL_EXPANDED_INDEX,
  MIN_SEARCH_STRING_LENGTH
} from '../constants';
import { ActorInfoProviderScorecardSearchResult } from '../provider-scorecards.model';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'report-cards',
  templateUrl: './report-cards.component.html',
  styleUrls: ['./report-cards.component.css']
})
/** Top-level presentation component handles Actor and Provider selection and hosts
 * Report Card presentation component.
 */
export class ReportCardsComponent implements OnDestroy {
  @ViewChild('actorSearchResultList')
  actorSearchResultList: MatSelectionList;

  @ViewChild('providerScorecardSearchResultList')
  providerScorecardSearchResultList: MatSelectionList;

  @ViewChild('actionSearchInput')
  actionSearchInput: ElementRef;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(public reportCardsService: ReportCardsService) { }

  maxActors = MAX_ACTORS;
  minActors = MIN_ACTORS;
  noActorSelectedMessage = NO_ACTOR_SELECTED_ERROR_MSG;
  spinnerDiameter = SPINNER_DIAMETER;

  expandedActorIndex = NO_ACTOR_PANEL_EXPANDED_INDEX;

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

    // If deleting person while in Step 0, try to clear
    // the selected checkbox for the person if s/he is in
    // the actor search result list
    if (this.actorSearchResultList) {
      this.actorSearchResultList.options.forEach(
        (searchResult: MatListOption) => {
          if (searchResult.value.id === actorId) {
            searchResult.selected = false;
          }
        }
      );
    }
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

  onExpandActorPanelByIndex(actorIndex: number) {
    this.expandedActorIndex = actorIndex;
  }

  onSearchStringChange(searchString: string) {
    if (searchString && searchString.length >= MIN_SEARCH_STRING_LENGTH) {
      this.reportCardsService.actorSearchString$.next(searchString);
    }
  }

  onActorPanelClosed(actorIndex: number) {
    if (this.expandedActorIndex === actorIndex) {
      this.expandedActorIndex = NO_ACTOR_PANEL_EXPANDED_INDEX;
    }

    this.reportCardsService.clearProviderScorecardSearchResults();
  }

  onActorPanelOpened(
    actorIndex: number,
    actorConfigId: string,
    actorConfigPersonId: string,
    actorConfigOfficeId: string
  ) {
    this.expandedActorIndex = actorIndex;
    console.log('panel opened' + this.expandedActorIndex);
    this.reportCardsService.onActorClicked(
      actorConfigId,
      actorConfigPersonId,
      actorConfigOfficeId
    );
  }

  onStepperSelectionChanged(event: StepperSelectionEvent) {

    // close any Actor expansion panel that might be opened.
    this.expandedActorIndex = NO_ACTOR_PANEL_EXPANDED_INDEX;
    this.reportCardsService.clearProviderScorecardSearchResults();

    // stepper selected Step 0 - Actor selection; clear any actor search results
    this.reportCardsService.actorSearchResults$.next(new Array<ActorSearchResult>());
  }

  onStepTwoTabChange(ev: MatTabChangeEvent) {
    // initialize action search string observable
    if (!this.reportCardsService.actionSearchInputElement && ev.index === 1) {
      this.reportCardsService.actionSearchInputElement = this.actionSearchInput;

      // subscribe http client to the observable
      this.reportCardsService.subscribeToActionSearchStrings();
    }
  }
}
