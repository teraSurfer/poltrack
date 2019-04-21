import { Injectable, OnDestroy, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, defer, combineLatest, Subject, BehaviorSubject, fromEvent } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  filter
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { NotificationService } from '@app/core/notifications/notification.service';
import { getHash, isValidDateString } from '@app/shared';
import { ActorSearchResult, Actor } from './actors.model';
import { selectAllActors, selectActorsIds } from './actors.selectors';
import { selectProviderScorecardsIds } from './provider-scorecards.selectors';
import { ActionActorsUpsertOne, ActionActorsDeleteOne } from './actors.actions';
import {
  ActionProviderScorecardsDeleteOne,
  ActionProviderScorecardsUpsertOne
} from './provider-scorecards.actions';
import {
  ActorInfoProviderScorecard,
  ActorInfoProviderScorecardSearchResult,
  ActorInfoProviderScorecardActionInfo
} from './provider-scorecards.model';
import { MAX_ACTORS, TOO_MANY_ACTORS_ERROR_MSG, FAKE_PERSON_ID, FAKE_OFFICE_ID, SEARCH_INPUT_DEBOUNCE_MS } from './constants';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { selectAllProviderScorecards } from './provider-scorecards.selectors';
import { ActorConfig, ActorInfoProviderScorecardConfig } from './report-cards-config.model';

/** Implements Report Cards input parameters search including Actor and Information Providers search */
@Injectable({
  providedIn: 'root'
})
export class ReportCardsService implements OnDestroy {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly store: Store<{}>,
    private readonly notificationService: NotificationService
  ) {
    this.actorSearchString$
      .pipe(
        debounceTime(SEARCH_INPUT_DEBOUNCE_MS),
        distinctUntilChanged(),
        tap(() => this.isActorSearchInProgress$.next(true)),
        switchMap(searchString =>
          this.httpClient
            .get<Array<ActorSearchResult>>(
              `http://localhost:7071/api/ActorSearch?q=${searchString}`
            )
            .pipe(
              tap(() => console.log('ActorSearch http request')),
              map((data: any) => this.toActorSearchResultItems(data))
            )
        )
      )
      .subscribe(searchResult => {
        this.actorSearchResults$.next(searchResult);
        this.isActorSearchInProgress$.next(false);
      });

    this.reportCardsConfigTreeDataSource$ = combineLatest(
      this.store.pipe(select(selectAllActors)).pipe(distinctUntilChanged(this.stateArrayComparer)),

      this.store.pipe(select(selectAllProviderScorecards)).pipe(distinctUntilChanged(this.stateArrayComparer))).
      pipe(
        map(
          ([actors, scorecards]) => {
            const result = new Array<ActorConfig>();
            let actorConfig: ActorConfig;
            let infoProviderScorecardConfig: ActorInfoProviderScorecardConfig;

            actors.forEach(actor => {
              actorConfig = { ...actor, infoProviderScorecards: new Array<ActorInfoProviderScorecardConfig>() };

              scorecards.forEach(scorecard => {
                if (scorecard.actorId === actorConfig.id) {
                  infoProviderScorecardConfig = { ...scorecard, actionsInfo: new Array<string>() };

                  actorConfig.infoProviderScorecards.push(infoProviderScorecardConfig);
                }
              });
              result.push(actorConfig);
            });
            return result;
          }
        ),
        tap((actorConfigs) => this.checkActionSelectionState(actorConfigs))
      );

    this.providerScorecardSearchRequest$
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.personId === y.personId &&
            x.officeId === y.officeId &&
            x.firstIndex === y.firstIndex;
        }),
        filter(searchParam => searchParam.personId !== FAKE_PERSON_ID && searchParam.officeId !== FAKE_OFFICE_ID),
        tap(() => this.isProviderScorecardSearchInProgress$.next(true)),
        switchMap(searchParams =>
          this.httpClient
            .get<Array<ActorInfoProviderScorecardSearchResult>>(
              `http://localhost:7071/api/ProviderSearch?` +
              `pid=${searchParams.personId}&oid=${searchParams.officeId}&fi=${searchParams.firstIndex}`
            )
            .pipe(
              tap(() => console.log('ProviderScorecardSearch http request')),
              map((data: any) =>
                this.toProviderScorecardSearchResultItems(data)
              )
            )
        )
      )
      .subscribe(searchResult => {
        this.providerScorecardSearchResults$.next(searchResult);
        this.isProviderScorecardSearchInProgress$.next(false);
      });

    this.store
      .pipe(select(selectActorsIds))
      .subscribe((actorsIds: string[]) => {
        this.selectedActorsIds = actorsIds;
      });

    this.store
      .pipe(select(selectProviderScorecardsIds))
      .subscribe((providerScorecardIds: Array<string>) => {
        this.selectedProviderScorecardsIds = providerScorecardIds;
      });
  }

  public actionSearchInput: ElementRef;
  public actionSearchString$: Observable<string> =
    defer(() => {
      return fromEvent(this.actionSearchInput.nativeElement, 'input').pipe(
        // map((e: KeyboardEvent) => e.target.value),
        filter((e: KeyboardEvent) => (<HTMLInputElement>e.target).value.length > 2),
        debounceTime(SEARCH_INPUT_DEBOUNCE_MS),
        distinctUntilChanged(),
        tap(() => this.isActionSearchInProgress$.next(true)),
        switchMap(searchString => {
          console.log('getting action data for:' + searchString);
          return 'xxx';
        }
        ));
    });

  public isActionSelectionStepComplete = false;
  public selectedActorsIds: string[] = new Array<string>();
  public actorToConfigure: { personId: string, officeId: string } =
    { personId: FAKE_PERSON_ID, officeId: FAKE_OFFICE_ID };
  public selectedProviderScorecardsIds: string[] = new Array<string>();

  public reportCardsConfigTreeDataSource$: Observable<Array<ActorConfig>>;

  public actorSearchResults$: BehaviorSubject<Array<ActorSearchResult>> =
    new BehaviorSubject(new Array<ActorSearchResult>());

  public isActionSearchInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isActorSearchInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public providerScorecardSearchResults$: BehaviorSubject<
    Array<ActorInfoProviderScorecardSearchResult>
  > = new BehaviorSubject(new Array<ActorInfoProviderScorecardSearchResult>());

  public isProviderScorecardSearchInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  public actorSearchString$ = new Subject<string>();

  public providerScorecardSearchRequest$ =
    new Subject<{ personId: string, officeId: string, firstIndex: number }>();

  /** returns true if two arrays have equal length and the IDs of corresponding array items match. */
  private stateArrayComparer(x, y): boolean {
    if (x.length !== y.length) {
      return false;
    }
    for (let i = 0; i < x.length; i++) {
      if (x[i].id !== y[i].id) {
        return false;
      }
    }
    return true;
  }

  public deleteActor(id: string): any {
    this.store.dispatch(new ActionActorsDeleteOne({ id: id }));
  }

  getReportCards() {
    this.notificationService.error('Not yet implemented');
  }

  public onProviderSearchButtonClicked() {
    this.providerScorecardSearchRequest$.next(
      { personId: this.actorToConfigure.personId, officeId: this.actorToConfigure.officeId, firstIndex: 1 }
    );
  }

  public subscribeToActionSearchResults() {
    this.actionSearchString$.subscribe(
      (value) => { console.log('received action search result' + value); }
    );
  }

  public tryUpsertActor(actor: Actor): boolean {
    if (this.selectedActorsIds.length >= MAX_ACTORS) {
      this.notificationService.error(TOO_MANY_ACTORS_ERROR_MSG);
      return false;
    }

    this.store.dispatch(new ActionActorsUpsertOne({ actor: actor }));
    return true;
  }

  /** Returns true if all "actors" in actorConfigs have at least one info
   * provider (action) configured, otherwise returns false.
   */
  public checkActionSelectionState(actorConfigs: Array<ActorConfig>) {
    if (actorConfigs) {
      let ret = true;
      // check if all actors have at least one action provider/action configured
      ActionSelectionStepCompleteLoop:
      for (let index = 0; index < actorConfigs.length; index++) {
        if (actorConfigs[index].infoProviderScorecards.length === 0) {
          ret = false;
          break ActionSelectionStepCompleteLoop;
        }
      }
      this.isActionSelectionStepComplete = ret;
    }
  }

  public clearProviderScorecardSearchResults() {
    // send provider search a fake actor to ensure that repeated opening and closing of the same actor
    // expansion panel yields expected result (i.e. the repeat search is not prevented by distinctUntilChanged)
    this.providerScorecardSearchRequest$.next({ personId: FAKE_PERSON_ID, officeId: FAKE_OFFICE_ID, firstIndex: 0 });
    this.providerScorecardSearchResults$.next(new Array<ActorInfoProviderScorecardSearchResult>());

  }

  public deleteProviderScorecard(id: string): any {
    this.store.dispatch(new ActionProviderScorecardsDeleteOne({ id: id }));
  }

  public upsertProviderScorecard(providerScorecard: ActorInfoProviderScorecard): any {
    this.store.dispatch(
      new ActionProviderScorecardsUpsertOne({
        providerscorecard: providerScorecard
      })
    );
  }

  public ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public subscribeToActionSearchStrings() {
    console.log('subscribed to action search string');

    this.actionSearchString$.subscribe(
      data => {
        console.log('action search string:');
        console.log(data);
      }
    );
  }

  private toActorSearchResultItems(data: {
    content: Array<any>;
    meta: any;
  }): Array<ActorSearchResult> {
    const resultItemsArrays: Array<ActorSearchResult> = new Array<
      ActorSearchResult
    >();

    data.content.forEach(item => {
      const calculatedId: string = String(
        getHash(item.personId + item.officeId)
      );

      let isActorSelected = false;

      for (let index = 0; index < this.selectedActorsIds.length; index++) {
        const selectedActorId = this.selectedActorsIds[index];
        if (selectedActorId === calculatedId) {
          isActorSelected = true;
          break;
        }
      }

      const calculatedTermStarted: Date = isValidDateString(item.termStarted)
        ? new Date(item.termStarted)
        : undefined;

      const calculatedTermEnded: Date = isValidDateString(item.termEnded)
        ? new Date(item.termEnded)
        : undefined;

      const uiSearchResultItem: ActorSearchResult = {
        id: calculatedId,
        isSelected: isActorSelected,
        item: {
          id: calculatedId,
          personId: item.personId,
          officeId: item.officeId,
          title: item.title,
          description: item.description,
          termStarted: calculatedTermStarted,
          termEnded: calculatedTermEnded
        }
      };
      resultItemsArrays.push(uiSearchResultItem);
    });

    return resultItemsArrays;
  }

  private toProviderScorecardSearchResultItems(data: {
    content: Array<any>;
    pid: string;
    oid: string;
    meta: any;
  }): Array<ActorInfoProviderScorecardSearchResult> {
    const resultItemsArrays: Array<ActorInfoProviderScorecardSearchResult> = new Array<
      ActorInfoProviderScorecardSearchResult
    >();

    data.content.forEach((item) => {
      const calculatedId: string = String(
        getHash(item.providerId + item.scorecardId + item.scorecardStartDate + item.scorecardEndDate)
      );

      let isProviderScorecardSelected = false;

      for (
        let index = 0;
        index < this.selectedProviderScorecardsIds.length;
        index++
      ) {
        const selectedProviderScorecardId = this.selectedProviderScorecardsIds[
          index
        ];
        if (selectedProviderScorecardId === calculatedId) {
          isProviderScorecardSelected = true;
          break;
        }
      }

      const calculatedScorecardStartDate: Date = isValidDateString(item.scorecardStartDate)
        ? new Date(item.scorecardStartDate)
        : undefined;

      const calculatedScorecardEndDate: Date = isValidDateString(item.scorecardEndDate)
        ? new Date(item.scorecardEndDate)
        : undefined;

      const uiSearchResultItem: ActorInfoProviderScorecardSearchResult = {
        id: calculatedId,
        isSelected: isProviderScorecardSelected,
        index: item.index,
        item: {
          id: calculatedId,
          actorId: String(getHash(data.pid + data.oid)),
          providerId: item.providerId,
          scorecardId: item.scorecardId,
          title: item.providerTitle,
          description: item.scorecardDescription,
          scorecardActionMaxWeight: item.scorecardActionMaxWeight,
          scorecardActionCount: item.scorecardActionCount,
          scorecardStartDate: calculatedScorecardStartDate,
          scorecardEndDate: calculatedScorecardEndDate
        }
      };
      resultItemsArrays.push(uiSearchResultItem);
    });

    return resultItemsArrays;
  }
}
