import { Injectable, OnDestroy, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, defer, combineLatest, Subject, BehaviorSubject, fromEvent, of } from 'rxjs';
import {
  map,
  merge,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  filter
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { NotificationService } from '@app/core/notifications/notification.service';
import { getHash, isValidDateString } from '@app/shared';
import { Actor } from './actors.model';
import { selectAllActors, selectActorsIds } from './actors.selectors';
import { selectProviderScorecardsIds } from './provider-scorecards.selectors';
import { ActionActorsUpsertOne, ActionActorsDeleteOne } from './actors.actions';
import {
  ActionProviderScorecardsDeleteOne,
  ActionProviderScorecardsUpsertOne
} from './provider-scorecards.actions';
import { ActorProviderScorecard } from './provider-scorecards.model';
import { ActorProviderScorecardAction } from './scorecard-actions.model';
import {
  MAX_ACTORS, TOO_MANY_ACTORS_ERROR_MSG, FAKE_PERSON_ID, FAKE_OFFICE_ID, FAKE_SEARCH_STRING, SEARCH_INPUT_DEBOUNCE_MS
} from './constants';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { selectAllProviderScorecards } from './provider-scorecards.selectors';
import {
  ActorConfig,
  ActorSearchResult,
  ActorProviderScorecardSearchResult,
  ActorProviderScorecardConfig
} from './report-cards-config.model';

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

    this.reportCardsConfigurationDataSource$ = combineLatest(
      this.store.pipe(select(selectAllActors)).pipe(distinctUntilChanged(this.stateArrayComparer)),

      this.store.pipe(select(selectAllProviderScorecards)).pipe(distinctUntilChanged(this.stateArrayComparer))).
      pipe(
        map(
          ([actors, allScorecards]) => {
            const result = new Array<ActorConfig>();
            let actorConfig: ActorConfig;
            let infoProviderScorecardConfig: ActorProviderScorecardConfig;

            actors.forEach(actor => {
              actorConfig = { ...actor, scorecards: new Array<ActorProviderScorecardConfig>() };

              allScorecards.forEach(scorecard => {
                if (scorecard.actorId === actorConfig.id) {
                  infoProviderScorecardConfig = { ...scorecard, actions: new Array<string>() };

                  actorConfig.scorecards.push(infoProviderScorecardConfig);
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
            .get<Array<ActorProviderScorecardSearchResult>>(
              `http://localhost:7071/api/ProviderSearch?` +
              `pid=${searchParams.personId}&oid=${searchParams.officeId}&fi=${searchParams.firstIndex}`
            )
            .pipe(
              tap(() => {
                console.log('ProviderScorecardSearch http request');
                this.latestScorecardSearchResults.clear();
             }),
              map((data: any) =>
                this.toProviderScorecardSearchResultItems(data)
              )
            )
        )
      )
      .subscribe(searchResult => {
        this.scorecardBrowseSearchResults$.next(searchResult);
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

    this.selectedScorecardIds$ = this.store.pipe(
      select(selectProviderScorecardsIds)
    );
  }

  /* PROPERTIES AND FIELDS */
  public actionSearchInput: ElementRef;
  public actionSearchRequest$: Observable<Array<ActorProviderScorecardSearchResult>> =
    defer(() => {
      return fromEvent(this.actionSearchInput.nativeElement, 'keyup').pipe(
        map((e: KeyboardEvent) => (<HTMLInputElement>e.target).value),
        filter((searchString: string) => (searchString.length > 2)),
        debounceTime(SEARCH_INPUT_DEBOUNCE_MS),
        merge(this.clearActionSearchResults$),
        distinctUntilChanged(),
        tap(() => this.isActionSearchInProgress$.next(true)),
        switchMap(searchString => {
          if (searchString === FAKE_SEARCH_STRING) {
            return of(new Array<ActorProviderScorecardSearchResult>());
          } else {
            return this.httpClient
              .get<Array<ActorProviderScorecardSearchResult>>(
                `http://localhost:7071/api/ActionSearch?` +
                `pid=${this.actorToConfigure.personId}&oid=${this.actorToConfigure.officeId}&fi=1&q=${searchString}`
              )
              .pipe(
                tap(() => {
                  console.log('ActionSearch http request');
                  this.latestScorecardSearchResults.clear();
                }),
                map((data: any) =>
                  this.toActionSearchResultItems(data)
                )
              );
          }
        }
        ));
    });

  public isActionSelectionStepComplete = false;
  public selectedActorsIds: string[] = new Array<string>();
  public actorToConfigure: { personId: string, officeId: string } =
    { personId: FAKE_PERSON_ID, officeId: FAKE_OFFICE_ID };
  public selectedProviderScorecardsIds: Array<string> = new Array<string>();
  public selectedScorecardIds$: Observable<Array<string> | Array<number>>;
  public scorecardSearchSearchResults$: BehaviorSubject<Array<ActorProviderScorecardSearchResult>> =
    new BehaviorSubject<Array<ActorProviderScorecardSearchResult>>(new Array<ActorProviderScorecardSearchResult>());

  public reportCardsConfigurationDataSource$: Observable<Array<ActorConfig>>;

  public actorSearchResults$: BehaviorSubject<Array<ActorSearchResult>> =
    new BehaviorSubject(new Array<ActorSearchResult>());

  public isActionSearchInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isActorSearchInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public scorecardBrowseSearchResults$: BehaviorSubject<
    Array<ActorProviderScorecardSearchResult>
  > = new BehaviorSubject(new Array<ActorProviderScorecardSearchResult>());

  public isProviderScorecardSearchInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  public actorSearchString$ = new Subject<string>();
  public clearActionSearchResults$ = new Subject<string>();

  public providerScorecardSearchRequest$ =
    new Subject<{ personId: string, officeId: string, firstIndex: number }>();

  /** Scorecards returned by the most recent search */
  private latestScorecardSearchResults = new Map<string, ActorProviderScorecard>();

  /* METHODS */
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
        if (actorConfigs[index].scorecards.length === 0) {
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
    this.scorecardBrowseSearchResults$.next(new Array<ActorProviderScorecardSearchResult>());

    this.clearActionSearchResults$.next(FAKE_SEARCH_STRING);
  }

  public deleteProviderScorecard(id: string): any {
    this.store.dispatch(new ActionProviderScorecardsDeleteOne({ id: id }));
  }

  public upsertProviderScorecardById(scorecardId: string) {
    const scorecard: ActorProviderScorecard = this.latestScorecardSearchResults.get(scorecardId);
    this.upsertProviderScorecard(scorecard);
  }

  public upsertProviderScorecard(providerScorecard: ActorProviderScorecard): any {
    this.store.dispatch(
      new ActionProviderScorecardsUpsertOne({
        providerscorecard: providerScorecard
      })
    );
  }

  public ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public subscribeToActionSearchResults() {
    this.actionSearchRequest$.subscribe(
      data => {
        this.scorecardSearchSearchResults$.next(data);
        this.isActionSearchInProgress$.next(false);
      }
    );
  }

  private toActionSearchResultItems(data: {
    content: Array<any>;
    pid: string;
    oid: string;
    meta: any;
  }): Array<ActorProviderScorecardSearchResult> {
    const resultItemsArrays: Array<ActorProviderScorecardSearchResult> = new Array<
      ActorProviderScorecardSearchResult
    >();

    const actorId = this.getActorId(data.pid, data.oid);

    data.content.forEach((providerScorecardItem) => {

      const actorProviderScorecardId = this.getProviderScorecardId(actorId,
        providerScorecardItem.providerId, providerScorecardItem.scorecardId,
        providerScorecardItem.scorecardStartDate, providerScorecardItem.scorecardEndDate);


      const calculatedScorecardStartDate: Date = isValidDateString(providerScorecardItem.scorecardStartDate)
        ? new Date(providerScorecardItem.scorecardStartDate)
        : undefined;

      const calculatedScorecardEndDate: Date = isValidDateString(providerScorecardItem.scorecardEndDate)
        ? new Date(providerScorecardItem.scorecardEndDate)
        : undefined;

      const newScorecardItem: ActorProviderScorecard = {
        id: actorProviderScorecardId,
        actorId: actorId,
        providerId: providerScorecardItem.providerId,
        scorecardId: providerScorecardItem.scorecardId,
        title: providerScorecardItem.providerTitle,
        description: providerScorecardItem.scorecardDescription,
        scorecardActionMaxWeight: providerScorecardItem.scorecardActionMaxWeight,
        scorecardActionCount: providerScorecardItem.scorecardActionCount,
        scorecardStartDate: calculatedScorecardStartDate,
        scorecardEndDate: calculatedScorecardEndDate
      };

      this.latestScorecardSearchResults.set(newScorecardItem.id, newScorecardItem);

      const scorecardSearchResultItem: ActorProviderScorecardSearchResult = {
        id: actorProviderScorecardId,
        isSelected: false,
        index: providerScorecardItem.index,
        item: {
          ...newScorecardItem,
          actions: new Array<ActorProviderScorecardAction>()
        }
      };

      providerScorecardItem.actions.forEach((actionItem) => {
        const calculatedId: string = String(
          getHash(actorProviderScorecardId + actionItem.actionId + actionItem.documentId));

        const newActionItem: ActorProviderScorecardAction = {
          id: calculatedId,
          actorProviderScorecardId: actorProviderScorecardId,
          actionId: actionItem.actionId,
          actionTypes: actionItem.actionTypes,
          preferredPositions: actionItem.preferredPositions,
          actionWeight: actionItem.weight,
          documentId: actionItem.documentId,
          documentUpdateDate: actionItem.documentUpdateDate,
          documentTitle: actionItem.documentTitle,
          documentContentFragment: actionItem.documentContentFragment
        };

        scorecardSearchResultItem.item.actions.push(newActionItem);
      });
      resultItemsArrays.push(scorecardSearchResultItem);
    });

    return resultItemsArrays;
  }

  private toActorSearchResultItems(data: {
    content: Array<any>;
    meta: any;
  }): Array<ActorSearchResult> {
    const resultItemsArrays: Array<ActorSearchResult> = new Array<
      ActorSearchResult
    >();

    data.content.forEach(item => {
      const calculatedId: string = this.getActorId(item.personId, item.officeId);

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
  }): Array<ActorProviderScorecardSearchResult> {
    const resultItemsArrays: Array<ActorProviderScorecardSearchResult> = new Array<
      ActorProviderScorecardSearchResult
    >();

    const actorId = this.getActorId(data.pid, data.oid);

    data.content.forEach((item) => {
      const calculatedId: string = this.getProviderScorecardId(actorId,
        item.providerId, item.scorecardId, item.scorecardStartDate, item.scorecardEndDate);

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

      const newScorecardItem: ActorProviderScorecard = {
        id: calculatedId,
        actorId: this.getActorId(data.pid, data.oid),
        providerId: item.providerId,
        scorecardId: item.scorecardId,
        title: item.providerTitle,
        description: item.scorecardDescription,
        scorecardActionMaxWeight: item.scorecardActionMaxWeight,
        scorecardActionCount: item.scorecardActionCount,
        scorecardStartDate: calculatedScorecardStartDate,
        scorecardEndDate: calculatedScorecardEndDate
      };

      this.latestScorecardSearchResults.set(newScorecardItem.id, newScorecardItem);

      const uiSearchResultItem: ActorProviderScorecardSearchResult = {
        id: calculatedId,
        isSelected: isProviderScorecardSelected,
        index: item.index,
        item: {
          ...newScorecardItem, actions: new Array<ActorProviderScorecardAction>()
        }
      };
      resultItemsArrays.push(uiSearchResultItem);
    });

    return resultItemsArrays;
  }

  /** returns calculated provider scorecard ID */
  private getProviderScorecardId(
    actorId: string,
    providerId: string,
    scorecardId: string,
    scorecardStartDate: string,
    scorecardEndDate: string
  ): string {
    return String(getHash(actorId + providerId + scorecardId + scorecardStartDate + scorecardEndDate));
  }

  /** return calculated actor ID */
  private getActorId(
    personId: string,
    officeId: string
  ) {
    return String(getHash(personId + officeId));
  }
}
