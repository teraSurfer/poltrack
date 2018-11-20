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

    this.providerScorecardSearchString$
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        tap(() => this.isProviderScorecardSearchInProgress$.next(true)),
        switchMap(searchString =>
          this.httpClient
            .get<Array<ProviderScorecardSearchResult>>(
              `http://localhost:7071/api/ProviderScorecardSearch?q=${searchString}`
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
        this.isActorSearchInProgress$.next(false);
      });

    this.store
      .pipe(select(selectActorsIds))
      .subscribe((actorsIds: string[]) => {
        this.selectedActorsIds = actorsIds;
      });
  }

  public selectedActorsIds: string[] = new Array<string>();
  public selectedProviderScorecardsIds: string[] = new Array<string>();

  public actors$: Observable<Array<Actor>>;

  public actorSearchResults$: BehaviorSubject<
    Array<ActorSearchResult>
  > = new BehaviorSubject(new Array<ActorSearchResult>());

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

  public providerScorecardSearchString$ = new Subject<string>();

  public deleteActor(id: string): any {
    this.store.dispatch(new ActionActorsDeleteOne({ id: id }));
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

    data.content.forEach(item => {
      const calculatedId: string = String(
        getHash(item.actorId + item.officeId)
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

      const calculatedScorecardStartDate: Date = isValidDateString(
        item.termStarted
      )
        ? new Date(item.scorecardStartDate)
        : undefined;

      const calculatedScorecardEndDate: Date = isValidDateString(item.termEnded)
        ? new Date(item.termEnded)
        : undefined;

      const uiSearchResultItem: ProviderScorecardSearchResult = {
        id: calculatedId,
        isSelected: isProviderScorecardSelected,
        item: {
          id: calculatedId,
          providerId: item.providerId,
          scorecardId: item.scorecardId,
          title: item.title,
          description: item.description,
          scorecardStartDate: calculatedScorecardStartDate,
          scorecardEndDate: calculatedScorecardEndDate
        }
      };
      resultItemsArrays.push(uiSearchResultItem);
    });

    return resultItemsArrays;
  }
}
