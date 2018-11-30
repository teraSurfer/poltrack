import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { NotificationService } from '@app/core/notifications/notification.service';
import { getHash, isValidDateString } from '@app/shared';
import { ActorSearchResult, Actor } from './actors.model';
import { selectAllActors, selectActorsIds } from './actors.selectors';
import { ActionActorsUpsertOne, ActionActorsDeleteOne } from './actors.actions';
import {
  ActionProviderScorecardsDeleteOne,
  ActionProviderScorecardsUpsertOne
} from './provider-scorecards.actions';
import {
  ProviderScorecard,
  ProviderScorecardSearchResult
} from './provider-scorecards.model';
import { MAX_ACTORS, TOO_MANY_ACTORS_ERROR_MSG } from './constants';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

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
        debounceTime(700),
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

    this.actors$ = this.store.pipe(select(selectAllActors));

    this.providerScorecardSearchRequest$
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        tap(() => this.isProviderScorecardSearchInProgress$.next(true)),
        switchMap(searchParams =>
          this.httpClient
            .get<Array<ProviderScorecardSearchResult>>(
              `http://localhost:7071/api/ProviderSearch?` +
              `aid=${searchParams.actorId}&oid=${searchParams.officeId}&fi=${searchParams.firstIndex}`
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

    this.actorIdToConfigure = this.selectedActorsIds[0];
  }

  public selectedActorsIds: string[] = new Array<string>();
  public actorIdToConfigure: string;
  public selectedProviderScorecardsIds: string[] = new Array<string>();

  public actors$: Observable<Array<Actor>>;

  public actorSearchResults$: BehaviorSubject<Array<ActorSearchResult>> =
    new BehaviorSubject(new Array<ActorSearchResult>());

  public isActorSearchInProgress$: BehaviorSubject<
    boolean
    > = new BehaviorSubject<boolean>(false);

  public providerScorecardSearchResults$: BehaviorSubject<
    Array<ProviderScorecardSearchResult>
    > = new BehaviorSubject(new Array<ProviderScorecardSearchResult>());

  public isProviderScorecardSearchInProgress$: BehaviorSubject<
    boolean
    > = new BehaviorSubject<boolean>(false);

  public actorSearchString$ = new Subject<string>();

  public providerScorecardSearchRequest$ =
    new Subject<{ actorId: string, officeId: string, firstIndex: number }>();

  public deleteActor(id: string): any {
    this.store.dispatch(new ActionActorsDeleteOne({ id: id }));
  }

  /** Updates the id of the Actor being configured with providers or actions */
  public onActorClicked(actorId) {
    this.actorIdToConfigure = actorId;
  }

  public onStepperSelectionChanged(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      // stepper selected Step 1 - Provider selection; retrieve providers for the default actor
      this.providerScorecardSearchRequest$.next({ actorId: 'a3', officeId: 'o3', firstIndex: 1 });
    }
  }

  public tryUpsertActor(actor: Actor): boolean {
    if (this.selectedActorsIds.length >= MAX_ACTORS) {
      this.notificationService.error(TOO_MANY_ACTORS_ERROR_MSG);
      return false;
    }

    this.store.dispatch(new ActionActorsUpsertOne({ actor: actor }));
    return true;
  }

  public deleteProviderScorecard(id: string): any {
    this.store.dispatch(new ActionProviderScorecardsDeleteOne({ id: id }));
  }

  public upsertProviderScorecard(providerScorecard: ProviderScorecard): any {
    this.store.dispatch(
      new ActionProviderScorecardsUpsertOne({
        providerScorecard: providerScorecard
      })
    );
  }

  public ngOnDestroy(): void {
    throw new Error('Method not implemented.');
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
        getHash(item.actorId + item.officeId)
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
          actorId: item.actorId,
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
    meta: any;
  }): Array<ProviderScorecardSearchResult> {
    const resultItemsArrays: Array<ProviderScorecardSearchResult> = new Array<
      ProviderScorecardSearchResult
      >();

    data.content.forEach((item) => {
      const calculatedId: string = String(
        getHash(item.providerId + item.scoreCardId + item.scorecardStartDate + item.scorecardEndDate)
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

      const uiSearchResultItem: ProviderScorecardSearchResult = {
        id: calculatedId,
        isSelected: isProviderScorecardSelected,
        index: item.index,
        item: {
          id: calculatedId,
          providerId: item.providerId,
          scorecardId: item.scorecardId,
          title: item.providerTitle,
          description: item.scorecardDescription,
          scorecardStartDate: calculatedScorecardStartDate,
          scorecardEndDate: calculatedScorecardEndDate
        }
      };
      resultItemsArrays.push(uiSearchResultItem);
    });

    return resultItemsArrays;
  }
}
